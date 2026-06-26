from googleapiclient.discovery import build
import pickle

with open("token.pkl", "rb") as token:
    creds = pickle.load(token)

service = build("calendar", "v3", credentials=creds)

simulation_keywords = [
    "Wake Up",
    "Wake Up Routine",
    "Breakfast",
    "Lunch",
    "Dinner",
    "College",
    "Project",
    "Project Meeting",
    "Club Activity",
    "Hackathon Meeting",
    "Team Review",
    "Movie Night",
    "Cricket",
    "Brunch",
    "Friends Hangout",
    "Family Time",
    "Shopping",
    "Weekly Planning"
]

events = service.events().list(
    calendarId="primary",
    maxResults=1000,
    singleEvents=True
).execute().get("items", [])

deleted = 0

for event in events:

    title = event.get("summary", "")

    if any(keyword in title for keyword in simulation_keywords):

        service.events().delete(
            calendarId="primary",
            eventId=event["id"]
        ).execute()

        deleted += 1

print(f"Deleted {deleted} events")