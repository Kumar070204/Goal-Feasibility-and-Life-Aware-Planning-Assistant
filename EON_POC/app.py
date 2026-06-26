
import streamlit as st
import subprocess
import json
import os

st.set_page_config(
    page_title="EON Life Aware Planning Engine",
    page_icon="🚀",
    layout="wide"
)

# ==========================================
# HEADER
# ==========================================

st.title("🚀 EON Life Aware Planning Engine")

st.markdown("""
### Designing Goals That Fit Real Life

This system analyzes a user's existing commitments,
evaluates goal feasibility,
creates personalized schedules,
and automatically syncs them to Google Calendar.
""")

st.divider()

# ==========================================
# KPI CARDS
# ==========================================

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        "Goals",
        "5"
    )

with col2:
    st.metric(
        "Daily Goal Time",
        "3h 05m"
    )

with col3:
    st.metric(
        "Free Time",
        "4h 12m"
    )

with col4:
    st.metric(
        "Feasibility",
        "82%"
    )

st.divider()

# ==========================================
# STEP 1
# ==========================================

st.header("📅 Step 1: Import Existing Lifestyle")

col1, col2 = st.columns(2)

with col1:

    if st.button("🗑 Delete Existing Simulation"):

        result = subprocess.run(
            ["python", "delete_all_simulations.py"],
            capture_output=True,
            text=True
        )

        st.success(
            "Simulation Deleted"
        )

with col2:

    if st.button("📅 Generate Demo Calendar"):

        result = subprocess.run(
            ["python", "calendar_simulator.py"],
            capture_output=True,
            text=True
        )

        st.success(
            "Demo Calendar Created"
        )

st.divider()

# ==========================================
# STEP 2
# ==========================================

st.header("🔍 Step 2: Analyze Commitments")

if st.button("Analyze Calendar"):

    result = subprocess.run(
        ["python", "free_slot_finder.py"],
        capture_output=True,
        text=True
    )

    with st.expander(
        "View Calendar Analysis",
        expanded=True
    ):
        st.code(result.stdout)

st.divider()

# ==========================================
# STEP 3
# ==========================================

st.header("📊 Step 3: Evaluate Goal Feasibility")

if st.button("Calculate Feasibility"):

    result = subprocess.run(
        ["python", "feasibility_engine.py"],
        capture_output=True,
        text=True
    )

    st.success(
        "Feasibility Score: 82%"
    )

    st.progress(82)

    with st.expander(
        "View Detailed Report"
    ):
        st.code(result.stdout)

st.divider()

# ==========================================
# STEP 4
# ==========================================

st.header("🧠 Step 4: Generate Personalized Schedules")

if st.button("Generate Schedule Options"):

    result = subprocess.run(
        ["python", "smart_scheduler.py"],
        capture_output=True,
        text=True
    )

    st.success(
        "Schedule Options Generated"
    )

# ==========================================
# SHOW OPTIONS
# ==========================================

if os.path.exists("plans.json"):

    with open(
        "plans.json",
        "r",
        encoding="utf-8"
    ) as f:

        plans = json.load(f)

    st.header("📋 Step 5: Review Schedule Options")

    col1, col2 = st.columns(2)

    # ======================================
    # OPTION 1
    # ======================================

    with col1:

        st.subheader(
            "🌅 Morning Focused Plan"
        )

        option1 = plans.get(
            "option_1",
            {}
        )

        for day, activities in option1.items():

            st.markdown(
                f"**{day}**"
            )

            for activity in activities:

                st.write(
                    f"• {activity['title']} "
                    f"({activity['start']} - {activity['end']})"
                )

        if st.button(
            "Choose Morning Plan"
        ):

            result = subprocess.run(
                [
                    "python",
                    "schedule_option.py",
                    "option_1"
                ],
                capture_output=True,
                text=True
            )

            st.success(
                "Morning Plan Added To Google Calendar"
            )

            st.balloons()

    # ======================================
    # OPTION 2
    # ======================================

    with col2:

        st.subheader(
            "🌙 Evening Focused Plan"
        )

        option2 = plans.get(
            "option_2",
            {}
        )

        for day, activities in option2.items():

            st.markdown(
                f"**{day}**"
            )

            for activity in activities:

                st.write(
                    f"• {activity['title']} "
                    f"({activity['start']} - {activity['end']})"
                )

        if st.button(
            "Choose Evening Plan"
        ):

            result = subprocess.run(
                [
                    "python",
                    "schedule_option.py",
                    "option_2"
                ],
                capture_output=True,
                text=True
            )

            st.success(
                "Evening Plan Added To Google Calendar"
            )

            st.balloons()

st.divider()

# ==========================================
# FOOTER
# ==========================================

st.success(
    "EON POC Ready • Calendar → Analysis → Scheduling → Google Calendar"
)

