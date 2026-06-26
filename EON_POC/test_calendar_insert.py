from googleapiclient.discovery import build
import pickle
from datetime import datetime, timedelta

with open("token.pkl", "rb") as token:
    creds = pickle.load(token)

service = build("calendar", "v3", credentials=creds)

tomorrow = datetime.now() + timedelta(days=1)

start = tomorrow.replace(
    hour=17,
    minute=0,
    second=0,
    microsecond=0
)

end = tomorrow.replace(
    hour=18,
    minute=0,
    second=0,
    microsecond=0
)

event = {
    "summary": "TEST GYM SESSION",
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

print("Event Created")