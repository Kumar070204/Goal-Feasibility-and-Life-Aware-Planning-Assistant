import os
import shutil

FILES_TO_REMOVE = [

    "app1.py",

    "calendar_analyzer.py",
    "calendar_event.py",
    "calendar_reader.py",
    "calendar_scheduler.py",
    "calendar_test.py",
    "calendar_test_insert.py",
    "test_calendar.py",

    "json_plan_generator.py",
    "planner.py",
    "python_scheduler.py",
    "reset.py",
    "save_plans.py",

    "schedule_balanced_plan.py",
    "schedule_generator.py",

    "show_plans.py",

    "slot_based_planner.py",
    "slot_extractor.py",

    "test_gemma.py"
]

BACKUP_FOLDER = "OLD_FILES"

os.makedirs(
    BACKUP_FOLDER,
    exist_ok=True
)

for file in FILES_TO_REMOVE:

    if os.path.exists(file):

        shutil.move(
            file,
            os.path.join(
                BACKUP_FOLDER,
                file
            )
        )

        print(f"Moved: {file}")

    else:

        print(f"Not Found: {file}")

print("\nCleanup Complete")
print(f"Files moved to {BACKUP_FOLDER}")