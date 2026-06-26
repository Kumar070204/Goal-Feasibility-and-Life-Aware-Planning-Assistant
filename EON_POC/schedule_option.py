import json
import pickle

from datetime import datetime, timedelta

from googleapiclient.discovery import build

# ==========================================
# WHICH OPTION TO SCHEDULE
# ==========================================

import sys

SELECTED_OPTION = sys.argv[1]

# change to:
#
# SELECTED_OPTION = "option_2"
#
# if needed

# ==========================================
# GOOGLE CALENDAR AUTH
# ==========================================

with open("token.pkl", "rb") as token:

    creds = pickle.load(token)

service = build(
    "calendar",
    "v3",
    credentials=creds
)

# ==========================================
# LOAD PLANS
# ==========================================

with open(
    "plans.json",
    "r",
    encoding="utf-8"
) as f:

    plans = json.load(f)

selected_plan = plans[
    SELECTED_OPTION
]

# ==========================================
# DAY MAPPING
# ==========================================

day_map = {

    "Monday": 0,

    "Tuesday": 1,

    "Wednesday": 2,

    "Thursday": 3,

    "Friday": 4,

    "Saturday": 5,

    "Sunday": 6
}

today = datetime.now()

# ==========================================
# CREATE EVENTS
# ==========================================

for day, activities in selected_plan.items():

    target_day = day_map[day]

    days_ahead = (
        target_day -
        today.weekday()
    ) % 7

    event_date = (
        today +
        timedelta(days=days_ahead)
    )

    for activity in activities:

        start_hour = int(
            activity["start"].split(":")[0]
        )

        start_min = int(
            activity["start"].split(":")[1]
        )

        end_hour = int(
            activity["end"].split(":")[0]
        )

        end_min = int(
            activity["end"].split(":")[1]
        )

        start_time = event_date.replace(
            hour=start_hour,
            minute=start_min,
            second=0,
            microsecond=0
        )

        end_time = event_date.replace(
            hour=end_hour,
            minute=end_min,
            second=0,
            microsecond=0
        )

        event = {

            "summary": f"EON - {activity['title']}",

            "start": {

                "dateTime":
                start_time.isoformat(),

                "timeZone":
                "Asia/Kolkata"
            },

            "end": {

                "dateTime":
                end_time.isoformat(),

                "timeZone":
                "Asia/Kolkata"
            }
        }

        service.events().insert(

            calendarId="primary",

            body=event

        ).execute()

        print(
            f"Added: "
            f"{activity['title']} "
            f"on "
            f"{day}"
        )

print()
print(
    f"{SELECTED_OPTION} scheduled successfully"
)