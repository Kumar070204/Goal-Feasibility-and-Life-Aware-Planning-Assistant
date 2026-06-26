from googleapiclient.discovery import build
import pickle
from datetime import datetime, timedelta
from collections import defaultdict
import json
import os

# ------------------
# FITNESS GOALS (Loaded dynamically or default)
# ------------------

GOAL_MINUTES = {
    "Gym": 60,
    "Walk": 60,
    "Read": 30,
    "Meditate": 20,
    "Journal": 15
}

SLEEP_HOURS = 8

if os.path.exists("goals.json"):
    try:
        with open("goals.json", "r", encoding="utf-8") as f:
            goals_data = json.load(f)
            SLEEP_HOURS = goals_data.get("sleep_hours", 8)
            custom_goals = goals_data.get("goals", [])
            if custom_goals:
                GOAL_MINUTES = {g["title"]: g["duration"] for g in custom_goals}
    except Exception as e:
        pass


# ------------------
# READ CALENDAR
# ------------------

with open("token.pkl", "rb") as token:
    creds = pickle.load(token)

service = build("calendar", "v3", credentials=creds)

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

daily_minutes = defaultdict(int)

for event in events:

    if "dateTime" not in event["start"]:
        continue

    start = datetime.fromisoformat(
        event["start"]["dateTime"].replace("Z", "+00:00")
    )

    end = datetime.fromisoformat(
        event["end"]["dateTime"].replace("Z", "+00:00")
    )

    duration = (
        end - start
    ).total_seconds() / 60

    day = start.strftime("%A")

    daily_minutes[day] += duration

# ------------------
# CALCULATE
# ------------------

total_busy = sum(daily_minutes.values())

avg_busy_hours = (total_busy / 7) / 60

actual_available_hours = (
    24 -
    SLEEP_HOURS -
    avg_busy_hours
)

goal_hours = (
    sum(GOAL_MINUTES.values())
    / 60
)

probability = min(
    100,
    round(
        (actual_available_hours / goal_hours)
        * 100
    )
)

print("\n====== EON FEASIBILITY ======\n")

print(
    f"Average Busy Time: "
    f"{avg_busy_hours:.2f} hrs/day"
)

print(
    f"Available Time: "
    f"{actual_available_hours:.2f} hrs/day"
)

print(
    f"Goal Time Needed: "
    f"{goal_hours:.2f} hrs/day"
)

print(
    f"Feasibility Score: "
    f"{probability}%"
)

if probability < 70:
    print("\nGOAL OVERLOAD DETECTED")
else:
    print("\nGOALS APPEAR ACHIEVABLE")