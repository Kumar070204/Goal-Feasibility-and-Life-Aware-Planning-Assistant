import json
from datetime import datetime, timedelta
import os

# ==========================================
# DAILY GOALS (Loaded dynamically or default)
# ==========================================

GOALS_OPTION_1 = [
    ("Walk", 60),
    ("Gym", 60),
    ("Read", 30),
    ("Meditate", 20),
    ("Journal", 15)
]

GOALS_OPTION_2 = [
    ("Gym", 60),
    ("Walk", 60),
    ("Read", 30),
    ("Meditate", 20),
    ("Journal", 15)
]

if os.path.exists("goals.json"):
    try:
        with open("goals.json", "r", encoding="utf-8") as f:
            goals_data = json.load(f)
            custom_goals = [(g["title"], g["duration"]) for g in goals_data.get("goals", [])]
            if custom_goals:
                GOALS_OPTION_1 = custom_goals.copy()
                GOALS_OPTION_2 = custom_goals.copy()
                if len(GOALS_OPTION_2) >= 2:
                    GOALS_OPTION_2[0], GOALS_OPTION_2[1] = GOALS_OPTION_2[1], GOALS_OPTION_2[0]
    except Exception as e:
        pass


# ==========================================
# LOAD SLOTS
# ==========================================

with open("slots.json", "r") as f:
    DAY_SLOTS = json.load(f)

# ==========================================
# HELPERS
# ==========================================

def minutes_between(start, end):

    s = datetime.strptime(start, "%H:%M")
    e = datetime.strptime(end, "%H:%M")

    return int(
        (e - s).total_seconds() / 60
    )

def add_minutes(time_str, mins):

    t = datetime.strptime(
        time_str,
        "%H:%M"
    )

    t += timedelta(
        minutes=mins
    )

    return t.strftime("%H:%M")

# ==========================================
# GENERIC SCHEDULER
# ==========================================

def generate_schedule(goals):

    weekly_schedule = {}

    for day, slots in DAY_SLOTS.items():

        schedule = []

        goal_index = 0

        for slot_start, slot_end in slots:

            available = minutes_between(
                slot_start,
                slot_end
            )

            current = slot_start

            while (
                available > 0
                and
                goal_index < len(goals)
            ):

                goal_name, duration = goals[
                    goal_index
                ]

                if duration <= available:

                    end_time = add_minutes(
                        current,
                        duration
                    )

                    schedule.append(
                        {
                            "title": goal_name,
                            "start": current,
                            "end": end_time
                        }
                    )

                    current = end_time

                    available -= duration

                    goal_index += 1

                else:
                    break

        weekly_schedule[day] = schedule

    return weekly_schedule

# ==========================================
# CREATE BOTH OPTIONS
# ==========================================

option_1 = generate_schedule(
    GOALS_OPTION_1
)

option_2 = generate_schedule(
    GOALS_OPTION_2
)

# ==========================================
# SAVE PLANS
# ==========================================

plans = {

    "option_1": option_1,

    "option_2": option_2

}

with open(
    "plans.json",
    "w"
) as f:

    json.dump(
        plans,
        f,
        indent=4
    )

# ==========================================
# DISPLAY OPTION 1
# ==========================================

print("\n")
print("=" * 50)
print("OPTION 1 - MORNING FOCUSED")
print("=" * 50)

for day, activities in option_1.items():

    print(f"\n{day}")
    print("-" * 30)

    for activity in activities:

        print(
            f"{activity['title']:<12}"
            f"{activity['start']} - "
            f"{activity['end']}"
        )

# ==========================================
# DISPLAY OPTION 2
# ==========================================

print("\n")
print("=" * 50)
print("OPTION 2 - EVENING FOCUSED")
print("=" * 50)

for day, activities in option_2.items():

    print(f"\n{day}")
    print("-" * 30)

    for activity in activities:

        print(
            f"{activity['title']:<12}"
            f"{activity['start']} - "
            f"{activity['end']}"
        )

print("\nplans.json created successfully")