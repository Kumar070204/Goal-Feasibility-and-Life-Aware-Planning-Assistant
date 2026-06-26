from googleapiclient.discovery import build
import pickle
from datetime import datetime, timedelta
from collections import defaultdict
import json

# -----------------------------
# LOAD GOOGLE CALENDAR TOKEN
# -----------------------------

with open("token.pkl", "rb") as token:
    creds = pickle.load(token)

service = build(
    "calendar",
    "v3",
    credentials=creds
)

# -----------------------------
# GET NEXT 7 DAYS EVENTS
# -----------------------------

now = datetime.utcnow().isoformat() + "Z"

next_week = (
    datetime.utcnow() +
    timedelta(days=7)
).isoformat() + "Z"

events_result = service.events().list(
    calendarId="primary",
    timeMin=now,
    timeMax=next_week,
    singleEvents=True,
    orderBy="startTime"
).execute()

events = events_result.get("items", [])

# -----------------------------
# GROUP EVENTS BY DAY
# -----------------------------

days = defaultdict(list)

for event in events:

    if "dateTime" not in event["start"]:
        continue

    start = datetime.fromisoformat(
        event["start"]["dateTime"].replace("Z", "+00:00")
    )

    end = datetime.fromisoformat(
        event["end"]["dateTime"].replace("Z", "+00:00")
    )

    day_name = start.strftime("%A")

    days[day_name].append(
        {
            "start": start,
            "end": end,
            "title": event["summary"]
        }
    )

# -----------------------------
# FIND FREE SLOTS
# -----------------------------

print("\n")
print("=" * 60)
print("FREE SLOT ANALYSIS")
print("=" * 60)

slots_dict = {
    "Monday": [["06:00", "23:00"]],
    "Tuesday": [["06:00", "23:00"]],
    "Wednesday": [["06:00", "23:00"]],
    "Thursday": [["06:00", "23:00"]],
    "Friday": [["06:00", "23:00"]],
    "Saturday": [["06:00", "23:00"]],
    "Sunday": [["06:00", "23:00"]]
}

for day, events in days.items():

    print(f"\n\n{day}")
    print("-" * 40)

    events.sort(
        key=lambda x: x["start"]
    )

    day_start = events[0]["start"].replace(
        hour=6,
        minute=0,
        second=0,
        microsecond=0
    )

    current_time = day_start
    day_slots = []

    for event in events:

        start = event["start"]
        end = event["end"]

        # Free slot before event

        if start > current_time:

            print(
                f"FREE : "
                f"{current_time.strftime('%H:%M')} "
                f"to "
                f"{start.strftime('%H:%M')}"
            )
            day_slots.append([
                current_time.strftime('%H:%M'),
                start.strftime('%H:%M')
            ])

        # Occupied slot

        print(
            f"BUSY : "
            f"{start.strftime('%H:%M')} "
            f"to "
            f"{end.strftime('%H:%M')} "
            f"({event['title']})"
        )

        if end > current_time:
            current_time = end

    day_end = current_time.replace(
        hour=23,
        minute=0,
        second=0,
        microsecond=0
    )

    if current_time < day_end:

        print(
            f"FREE : "
            f"{current_time.strftime('%H:%M')} "
            f"to "
            f"{day_end.strftime('%H:%M')}"
        )
        day_slots.append([
            current_time.strftime('%H:%M'),
            day_end.strftime('%H:%M')
        ])
    
    slots_dict[day] = day_slots

# Write to slots.json
with open("slots.json", "w", encoding="utf-8") as f:
    json.dump(slots_dict, f, indent=4)

print("\n")
print("=" * 60)
print("ANALYSIS COMPLETE & slots.json SAVED")
print("=" * 60)