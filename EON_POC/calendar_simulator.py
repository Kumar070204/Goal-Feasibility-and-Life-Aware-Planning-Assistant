from googleapiclient.discovery import build
import pickle
from datetime import datetime, timedelta

# Load Google Calendar credentials
with open("token.pkl", "rb") as token:
    creds = pickle.load(token)

service = build("calendar", "v3", credentials=creds)

# Weekly simulation schedule
week_schedule = {
    0: [  # Monday
        ("Wake Up Routine", 7, 0, 8, 0),
        ("Breakfast", 8, 0, 8, 30),
        ("College", 9, 0, 17, 0),
        ("Lunch", 13, 0, 14, 0),
        ("Project Meeting", 18, 0, 19, 0),
        ("Dinner", 20, 0, 21, 0)
    ],

    1: [  # Tuesday
        ("Breakfast", 8, 0, 8, 30),
        ("College", 9, 0, 17, 0),
        ("Club Activity", 17, 30, 19, 0),
        ("Dinner", 20, 0, 21, 0)
    ],

    2: [  # Wednesday
        ("Breakfast", 8, 0, 8, 30),
        ("College", 9, 0, 17, 0),
        ("Hackathon Meeting", 18, 0, 20, 0),
        ("Dinner", 20, 30, 21, 0)
    ],

    3: [  # Thursday
        ("Breakfast", 8, 0, 8, 30),
        ("College", 9, 0, 17, 0),
        ("Team Review", 16, 0, 17, 0),
        ("Dinner", 20, 0, 21, 0)
    ],

    4: [  # Friday
        ("Breakfast", 8, 0, 8, 30),
        ("College", 9, 0, 16, 0),
        ("Movie Night", 19, 0, 22, 0)
    ],

    5: [  # Saturday
        ("Cricket", 7, 0, 9, 0),
        ("Brunch", 10, 0, 11, 0),
        ("Friends Hangout", 17, 0, 21, 0)
    ],

    6: [  # Sunday
        ("Family Time", 10, 0, 13, 0),
        ("Shopping", 16, 0, 18, 0),
        ("Weekly Planning", 20, 0, 21, 0)
    ]
}

today = datetime.now()

for day_offset in range(7):

    current_date = today + timedelta(days=day_offset)

    weekday = current_date.weekday()

    if weekday not in week_schedule:
        continue

    for title, sh, sm, eh, em in week_schedule[weekday]:

        start = current_date.replace(
            hour=sh,
            minute=sm,
            second=0,
            microsecond=0
        )

        end = current_date.replace(
            hour=eh,
            minute=em,
            second=0,
            microsecond=0
        )

        event = {
            "summary": title,
            "start": {
                "dateTime": start.isoformat(),
                "timeZone": "Asia/Kolkata"
            },
            "end": {
                "dateTime": end.isoformat(),
                "timeZone": "Asia/Kolkata"
            }
        }

        service.events().insert(
            calendarId="primary",
            body=event
        ).execute()

        print(f"Created: {title}")

print("\nWeekly simulation created successfully!")