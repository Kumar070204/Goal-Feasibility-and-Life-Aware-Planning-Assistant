<div align="center">

<img src="web/public/globe.svg" alt="EON Logo" width="80" height="80" />

# Goal Feasibility & Life-Aware Planning Engine

**An Intelligent Full-Stack Decision Support System designed for EON Health to optimize habits around real-world calendar commitments.**

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python&logoColor=white)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](#)
[![Google Calendar](https://img.shields.io/badge/Google%20Calendar-API%20v3-4285F4?style=for-the-badge&logo=googlecalendar&logoColor=white)](#)
[![AI](https://img.shields.io/badge/AI-Ollama%20%2F%20Gemma3-FF6F61?style=for-the-badge&logo=ollama&logoColor=white)](#)
[![ML](https://img.shields.io/badge/Machine%20Learning-Greedy%20Optimization-009688?style=for-the-badge&logo=scikit-learn&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#22-license)

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)](#)
[![Last Updated](https://img.shields.io/badge/Last%20Updated-June%202026-brightgreen?style=flat-square)](#)
[![Demo](https://img.shields.io/badge/Demo-Available-blue?style=flat-square)](#8-demo-video)

</div>

<p align="center">
  Traditional planners fail because they schedule tasks in a vacuum. EON's <strong>Life-Aware Planning Engine</strong> queries your primary Google Calendar in real-time, calculates a mathematical feasibility score based on your pre-existing commitments and sleep requirements, dynamically finds free time blocks, and pushes optimized, high-priority habit routines directly back into your calendar.
</p>

<div align="center">

[Overview](#3-project-overview) · [Features](#4-features) · [Architecture](#5-system-architecture) · [Installation](#10-installation) · [Usage](#13-running-the-project) · [Contributing](#21-contributing)

</div>

---

## 📋 Table of Contents

<details open>
<summary><b>Click to expand / collapse</b></summary>

1. [Hero Section](#1-hero-section)
2. [Table of Contents](#2-table-of-contents)
3. [Project Overview](#3-project-overview)
4. [Features](#4-features)
5. [System Architecture](#5-system-architecture)
6. [Workflow](#6-workflow)
7. [Screenshots](#7-screenshots)
8. [Demo Video](#8-demo-video)
9. [Repository Structure](#9-repository-structure)
10. [Installation](#10-installation)
11. [Requirements](#11-requirements)
12. [Environment Variables & Auth](#12-environment-variables--auth)
13. [Running the Project](#13-running-the-project)
14. [Sample Output](#14-sample-output)
15. [Feasibility Score](#15-feasibility-score)
16. [Scheduling Algorithm](#16-scheduling-algorithm)
17. [Technologies Used](#17-technologies-used)
18. [Future Improvements](#18-future-improvements)
19. [Research Opportunities](#19-research-opportunities)
20. [Known Limitations](#20-known-limitations)
21. [Contributing](#21-contributing)
22. [License](#22-license)
23. [Acknowledgements](#23-acknowledgements)
24. [Contact](#24-contact)

</details>

---

## 3. Project Overview

### 🧩 The Problem

Most personal planners and calendar systems assume unlimited human capacity. They allow users to create ambitious goals (e.g., working out 2 hours daily, reading 1 hour, meditating 30 minutes) without analyzing their pre-existing calendar commitments. Consequently:

- **Over-scheduling** leads to immediate failure, guilt, and abandonment of habits.
- **Calendar fragmentation** splits open slots into tiny, unusable blocks.
- **Unrealistic expectations** ignore essential human buffers like sleep and transit times.

### ✅ What EON Solves

EON is a **Life-Aware Planning Engine** developed as a Proof of Concept (POC) for **EON Health**. Rather than acting as a simple calendar overlay, it treats time as a finite budget:

| Step | Action |
| :--: | :--- |
| 1 | **Deducts Fixed Commitments** — Queries the Google Calendar API to pull active events (work, classes, travel) for the next 7 days. |
| 2 | **Accounts for Core Budgets** — Deducts essential sleep hours (configurable by the user, e.g., 8 hours). |
| 3 | **Calculates Feasibility** — Formulates a mathematical feasibility percentage by comparing the remaining free time with the total time required for all configured goals. |
| 4 | **Greedily Maps Habits** — Finds contiguous free slots throughout the day and schedules habits based on priority and user-selected scheduling styles (e.g., Morning Focused vs. Evening Focused). |
| 5 | **Generates AI Insights** — Leverages Ollama (with Gemma 3) to analyze schedule structures and explain the tradeoffs of each option. |

### 🏥 Healthcare & Business Relevance

In healthcare and preventative wellness, habit compliance is the single greatest bottleneck to positive patient outcomes. By deploying EON's life-aware planning engine, health tech providers like EON Health can:

- **Increase Patient Compliance** — Reduce friction in health, rehabilitation, and fitness routines.
- **Prevent Wellness Burnout** — Flag unrealistic health plans before the patient attempts and fails them.
- **Enable Personalization** — Offer dynamic scheduling that automatically routes workouts, medication, or therapy around professional lives.

---

## 4. Features

| Feature | Description | Business Value |
| :--- | :--- | :--- |
| 📅 **Google Calendar Integration** | Two-way sync with primary calendars using OAuth 2.0. | Automatic data ingestion without manual typing. |
| 🔍 **Availability Detection** | Scans next 7 days for busy blocks and calculates free slots. | Prevents scheduling over existing appointments. |
| 📊 **Goal Feasibility Scoring** | Mathematical ratio of available hours to goal hours. | Realistic habit budgets, preventing goal overload. |
| 🤖 **AI Schedule Generation** | Swaps priority order to produce distinct morning/evening variations. | Accommodates different chronotypes (morning vs night). |
| 🎯 **Priority-Based Planning** | Higher-duration and primary goals are packed first. | Ensures critical habits get scheduled even on busy days. |
| ⚠️ **Conflict Detection** | Multi-pass collision checking against calendar events. | Eliminates overlapping slots and scheduling conflicts. |
| ⏱️ **Time Optimization** | Packs multiple short habits sequentially into single blocks. | Maximizes efficiency and reduces calendar fragmentation. |
| ⚖️ **Balanced Scheduling** | Distributes habits across the entire week. | Sustains consistency over one-off bursts of activity. |
| 💡 **Adaptive Recommendations** | AI-generated reasoning highlights tradeoffs of option sets. | Clinician-like guidance customized for the user's lifestyle. |
| 📈 **Productivity Analytics** | Real-time dashboards visualizing sleep, busy, and goal ratios. | Immediate clarity on how daily hours are allocated. |
| 🧪 **Calendar Simulation** | Mock calendar generation script to populate sandbox schedules. | Effortless local testing and demonstration. |
| 🌙 **Dynamic Free Slot ID** | Filters available hours from 06:00 to 23:00 to match waking windows. | Ensures routines are scheduled during active hours. |

---

## 5. System Architecture
graph TD
    subgraph GC["Google Calendar Cloud"]
        GCal["Google Calendar API v3"]
    end

    subgraph EON["EON Python Engine (EON_POC)"]
        TS["token.pkl <br> credentials.json"] --> Auth["Google Auth Library"]
        GCal <-->|Sync Events| API["Google API Client"]

        CS["calendar_simulator.py"] -->|Insert Base Lifestyle| API
        DS["delete_all_simulations.py"] -->|Reset Sandbox| API

        API -->|Read Events| FSF["free_slot_finder.py"]
        FSF -->|Compute Free Windows| Slots["slots.json"]

        FE["feasibility_engine.py"] -->|Evaluate Budgets| F_Calc["Feasibility Calculator"]
        F_Calc -->|Output Metrics| Metrics["Average Busy, Sleep, Feasibility %"]

        SS["smart_scheduler.py"] -->|Pack Goals in Slots| S_Calc["Greedy Slot Allocator"]
        S_Calc -->|Compile Schedules| Plans["plans.json"]

        PE["plan_explainer.py"] -->|Fetch plans.json| PE_Ollama["Ollama: Gemma 3"]
        PE_Ollama -->|Generate Summaries| Insights["AI Insights"]

        SO["schedule_option.py"] -->|Sync Choice| SO_Sync["Sync Engine"]
        SO_Sync -->|Write Events| API
    end

    subgraph WEB["Next.js Web Interface (web)"]
        UI["Web Dashboard & Settings"] <-->|Fetch API Requests| Routes["Next.js API Routes"]
        Routes -->|Execute Script Process| PR["python-runner.ts"]
        PR -->|Execute python scripts| API
    end

### Component Breakdown

| Component | Role |
| :--- | :--- |
| **Calendar API** (Google Calendar) | Serves as the source of truth for the user's primary schedule. |
| **Analyzer** (`free_slot_finder.py`) | Groups events by day, establishes active waking hours (06:00 – 23:00), and outputs `slots.json` identifying free contiguous blocks. |
| **Feasibility Engine** (`feasibility_engine.py`) | Computes daily sleep hours, average busy hours, available hours, and outputs the final compliance capability percentage. |
| **Scheduler** (`smart_scheduler.py`) | Runs a greedy search algorithm to map goals sequentially into open time blocks, producing two alternative schedule plans (`plans.json`). |
| **Recommendation Generator** (`plan_explainer.py`) | Prompts an LLM (Gemma 3) locally using Ollama to output textual insights comparing the scheduled options. |
| **Next.js Web Interface** | Dashboard visualizing calendar utilization, active habits configurations, and schedule reviews with instant one-click sync buttons. |

---

## 6. Workflow

```text
 User defines goals & sleep hours in UI
                  │
                  ▼
       Trigger: Run Planning Pipeline
                  │
                  ▼
 Step 1 │ free_slot_finder.py queries Google Calendar API
                  │
                  ▼
 Step 2 │ Calculate daily free slots & save to slots.json
                  │
                  ▼
 Step 3 │ feasibility_engine.py calculates feasibility %
                  │
                  ▼
 Step 4 │ smart_scheduler.py packs habits & saves plans.json
                  │
                  ▼
 Step 5 │ plan_explainer.py compiles AI Insights tradeoffs
                  │
                  ▼
 Step 6 │ User reviews Option 1 & Option 2 on Web Interface
                  │
                  ▼
 Step 7 │ User clicks Sync → schedule_option.py commits to Google Calendar
```

| # | Stage | Description |
| :-: | :--- | :--- |
| 1 | **Input** | User configures daily sleep hours and active habits (e.g. Walk: 60m, Gym: 60m) inside the web interface. |
| 2 | **Analysis** | The pipeline calls `free_slot_finder.py` to extract occupied blocks from Google Calendar and identify available time intervals. |
| 3 | **Assessment** | `feasibility_engine.py` aggregates free hours and flags potential overloading. |
| 4 | **Planning** | `smart_scheduler.py` runs and assigns time blocks to habits, preparing two distinct routines. |
| 5 | **AI Synthesis** | Ollama parses the final layout and provides insights comparing the morning and evening formats. |
| 6 | **Execution** | The user picks their preferred routine, triggering `schedule_option.py` to write the calendar entries in real-time. |

---

## 7. Screenshots

### 🌅 Google Calendar: Prior to Running EON

The user's primary calendar contains work shifts, college schedules, meetings, and dinners. No wellness habits are scheduled, and open slots are fragmented.

<p align="center">
  <img src="assets/calendar_before.png" alt="Google Calendar Before EON Planning" width="80%"/>
  <br/>
  <em>Figure 1: Sandbox primary calendar showing base commitments before scheduling.</em>
</p>

### 🚀 Google Calendar: Populated with EON Scheduled Habits

After running the pipeline and syncing, EON maps the selected routine (e.g., Morning Focus) and inserts the workouts, walks, and reading sessions into the free blocks.

<p align="center">
  <img src="assets/calendar_after.png" alt="Google Calendar After EON Planning" width="80%"/>
  <br/>
  <em>Figure 2: Sandbox primary calendar after syncing EON's Morning Focused Plan.</em>
</p>

> [!NOTE]
> Please save the screenshots in `web/public/assets/` or `assets/` at the root of the project with the names `calendar_before.png` and `calendar_after.png`.

---

## 8. Demo Video

🎥 **Watch EON Life-Aware Planning Engine Demo**

Below is the walkthrough video showing the system query Google Calendar events, evaluate the feasibility index in real-time, generate the morning and evening variations, and update Google Calendar immediately:

<p align="center">
  <a href="demo/demo.mp4">
    <img src="assets/calendar_after.png" alt="EON Project Demo Video" width="60%"/>
  </a>
</p>

*Link to the original raw video file:* **[demo/demo.mp4](demo/demo.mp4)**

> [!TIP]
> If you upload this project repository to GitHub, you can upload the video file `demo/demo.mp4` to a GitHub Release or host it on YouTube, then replace the URL in this section with the online video link.

---

## 9. Repository Structure

```text
Goal-Feasibility-and-Life-Aware-Planning-Assistant/
├── EON_POC/                        # Core Python Engine
│   ├── app.py                      # Streamlit alternative local interface
│   ├── calendar_simulator.py       # Google Calendar Sandbox injector
│   ├── cleanup.py                  # Helper script to reset calendar states
│   ├── credentials.json            # Google OAuth 2.0 client configuration (ignored)
│   ├── delete_all_simulations.py   # Calendar simulation cleanup script
│   ├── execution_logs.json         # History log file for UI console settings
│   ├── feasibility_engine.py       # Compliance engine calculating feasibility %
│   ├── free_slot_finder.py         # Google Calendar analyzer outputting free slots
│   ├── plan_explainer.py           # Ollama Gemma 3 integration for AI summaries
│   ├── plans.json                  # Compiled schedule options (Option 1 & 2)
│   ├── schedule_option.py          # Google Calendar scheduling commit engine
│   ├── slots.json                  # Extracted free slots grouped by day
│   ├── smart_scheduler.py          # Greedy scheduling packing engine
│   ├── test_calendar_insert.py     # Sandbox insertion verification script
│   └── token.pkl                   # OAuth credentials user session token (ignored)
├── web/                            # Full-stack Next.js Web Interface
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/                # Next.js API Routes (Proxy to Python process)
│   │   │   │   ├── calendar/
│   │   │   │   │   ├── action/route.ts
│   │   │   │   │   └── status/route.ts
│   │   │   │   ├── goals/route.ts
│   │   │   │   ├── logs/route.ts
│   │   │   │   └── pipeline/
│   │   │   │       ├── analyze/route.ts
│   │   │   │       ├── schedule/route.ts
│   │   │   │       └── sync/route.ts
│   │   │   ├── goals/              # Goal manager page
│   │   │   ├── schedule/           # Schedule options & sync page
│   │   │   ├── settings/           # System logs & settings page
│   │   │   ├── globals.css         # Tailwind & custom CSS variables
│   │   │   ├── layout.tsx          # Global template layout
│   │   │   └── page.tsx            # Interactive main dashboard
│   │   ├── components/
│   │   │   ├── Sidebar.tsx         # Shared navigation sidebar
│   │   │   └── Toast.tsx           # Framer motion toast alerts
│   │   └── lib/
│   │       └── python-runner.ts    # Node child process python execution manager
│   ├── package.json
│   └── tsconfig.json
├── demo/
│   └── demo.mp4                    # Complete project walkthrough demonstration video
├── assets/
│   ├── calendar_before.png         # Image showing calendar prior to EON routine
│   └── calendar_after.png          # Image showing calendar populated by EON routine
├── .gitignore                      # Git ignored files configuration
└── README.md                       # Documentation
```

| Directory | Purpose |
| :--- | :--- |
| **`EON_POC/`** | Holds the Python core engine scripts that handle Google Calendar API connections, parsing, greedy calculations, scheduling, and LLM text completions. |
| **`web/`** | Holds the modern Next.js 16 user interface, complete with API routing endpoints that spawn the python modules asynchronously as child processes. |
| **`demo/` & `assets/`** | Houses design walkthroughs, screenshots, and visual aids. |

---

## 10. Installation

### Prerequisites

| Requirement | Version | Notes |
| :--- | :--- | :--- |
| **Python** | 3.10+ | Required for the core engine. |
| **Node.js** | 18.x / 20.x / 22.x | Required for the Next.js interface. |
| **Ollama** | Latest | Optional — used for AI explanation features; fallback will kick in if missing. |

### Step-by-Step Installation

**1. Clone the Repository**

```bash
git clone https://github.com/Kumar070204/Goal-Feasibility-and-Life-Aware-Planning-Assistant.git
cd Goal-Feasibility-and-Life-Aware-Planning-Assistant
```

**2. Configure Python Virtual Environment**

<table>
<tr><th>Windows (PowerShell)</th><th>macOS / Linux</th></tr>
<tr>
<td>

```powershell
cd EON_POC
python -m venv venv
.\venv\Scripts\Activate.ps1
```

</td>
<td>

```bash
cd EON_POC
python3 -m venv venv
source venv/bin/activate
```

</td>
</tr>
</table>

**3. Install Python Dependencies**

```bash
pip install -r requirements.txt
```

**4. Configure Next.js Web Interface**

Open a second terminal window at the project root folder.

```bash
cd web
npm install
```

**5. Verify CLI Installation**

Ensure python can read standard arguments without issue:

```bash
python --version
npm --version
```

---

## 11. Requirements

### 🐍 Python Dependencies (`EON_POC/requirements.txt`)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `google-api-python-client` | `^2.115.0` | Queries and writes events to Google Calendar. |
| `google-auth-httplib2` | `^0.2.0` | Helper wrapper library for HTTP queries. |
| `google-auth-oauthlib` | `^1.2.0` | Configures and triggers local browser OAuth 2.0 flows. |
| `streamlit` | `^1.30.0` | Runs the fallback Python-native Streamlit dashboard. |
| `ollama` | `^0.2.1` | Queries the local Gemma 3 models for scheduling summaries. |

### 🌐 Web Node Dependencies (`web/package.json`)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `next` | `16.2.9` | Full-stack framework containing client and server API routers. |
| `react` & `react-dom` | `19.2.4` | Rendering engine for the responsive user interface. |
| `framer-motion` | `^12.40.0` | Orchestrates dashboard widgets and calendar transitions. |
| `lucide-react` | `^1.17.0` | Provides visual iconography. |
| `tailwindcss` | `^4.0.0` | Styling and visual layout. |

---

## 12. Environment Variables & Auth

EON connects to Google Calendar using an OAuth 2.0 Client credential.

### Setting Up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named **EON Planning Sandbox**.
3. Navigate to **APIs & Services → Library**, search for **Google Calendar API**, and click **Enable**.
4. Navigate to **APIs & Services → OAuth Consent Screen**, select **External**, and register your app (add your email to test users!).
5. Go to **APIs & Services → Credentials**, click **Create Credentials → OAuth Client ID**.
6. Select application type **Desktop Application** and download the client secret JSON file.
7. Rename the downloaded file to `credentials.json` and place it in the `EON_POC/` directory.

> [!WARNING]
> The first time you execute any script accessing Google Calendar, a browser tab will open requesting permissions. Agree to synchronize scopes. This generates `token.pkl` locally which must **never** be committed to GitHub.

---

## 13. Running the Project

Ensure you have your environment set up and `credentials.json` copied into `EON_POC/`.

### ▶️ Launching the Web Interface (Recommended)

This runs both the Next.js server and routes commands dynamically:

```bash
cd web
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 🛠️ Script Reference Manual

<details>
<summary><b>1. Simulation Setup — <code>calendar_simulator.py</code></b></summary>
<br/>

**What it does:** Populates your sandbox calendar with a standard, busy weekly timetable (classes, club meetings, dinner, cricket).

**Command:**
```bash
python calendar_simulator.py
```

**Expected Console Output:**
```text
Created: Wake Up Routine
Created: Breakfast
Created: College
...
Weekly simulation created successfully!
```

**Files Generated:** None (writes to Google Calendar).
**Next Step:** Run `free_slot_finder.py` to analyze the new calendar structure.

**Possible Errors & Troubleshooting:**
| Error | Fix |
| :--- | :--- |
| `FileNotFoundError: [Errno 2] No such file or directory: 'token.pkl'` | Execute a script like `free_slot_finder.py` first to trigger browser OAuth login and create the session token. |

</details>

<details>
<summary><b>2. Free Slot Analyzer — <code>free_slot_finder.py</code></b></summary>
<br/>

**What it does:** Pulls next week's calendar events, identifies waking hours (06:00 – 23:00) that do not contain events, and saves the open blocks.

**Command:**
```bash
python free_slot_finder.py
```

**Expected Console Output:**
```text
============================================================
FREE SLOT ANALYSIS
============================================================
Monday
----------------------------------------
BUSY : 07:00 to 08:00 (Wake Up Routine)
FREE : 08:00 to 09:00
BUSY : 09:00 to 17:00 (College)
...
ANALYSIS COMPLETE & slots.json SAVED
============================================================
```

**Files Generated:** `slots.json` (contains day-by-day arrays of available `[start, end]` strings).
**Next Step:** Calculate feasibility using `feasibility_engine.py`.

</details>

<details>
<summary><b>3. Feasibility Engine — <code>feasibility_engine.py</code></b></summary>
<br/>

**What it does:** Reads commitments and evaluates the feasibility score of your current active habits.

**Command:**
```bash
python feasibility_engine.py
```

**Expected Console Output:**
```text
====== EON FEASIBILITY ======

Average Busy Time: 9.75 hrs/day
Available Time: 6.25 hrs/day
Goal Time Needed: 3.08 hrs/day
Feasibility Score: 82%

GOALS APPEAR ACHIEVABLE
```

**Files Generated:** None.
**Possible Errors:** If goals duration totals more than available hours, score will drop below 70%, printing `GOAL OVERLOAD DETECTED`.

</details>

<details>
<summary><b>4. Smart Scheduler — <code>smart_scheduler.py</code></b></summary>
<br/>

**What it does:** Schedules your habits into the free windows in `slots.json` using the greedy algorithm, outputting Option 1 and Option 2.

**Command:**
```bash
python smart_scheduler.py
```

**Expected Console Output:**
```text
==================================================
OPTION 1 - MORNING FOCUSED
==================================================
Monday
------------------------------
Gym          08:00 - 09:00
...
plans.json created successfully
```

**Files Generated:** `plans.json` (holds structured schedule mappings for options 1 and 2).

</details>

<details>
<summary><b>5. Commit Sync Engine — <code>schedule_option.py</code></b></summary>
<br/>

**What it does:** Reads plans from `plans.json` and pushes the selected configuration directly to Google Calendar.

**Command:**
```bash
python schedule_option.py option_1
```

**Expected Console Output:**
```text
Added: Gym on Monday
Added: Walk on Monday
...
option_1 scheduled successfully
```

**Files Generated:** None.

</details>

<details>
<summary><b>6. Reset Sandbox — <code>delete_all_simulations.py</code></b></summary>
<br/>

**What it does:** Queries Google Calendar and deletes all simulation events, leaving your original calendar clean.

**Command:**
```bash
python delete_all_simulations.py
```

**Expected Console Output:**
```text
Deleted 34 events
```

**Files Generated:** None.

</details>

---

## 14. Sample Output

### 📊 Feasibility Analysis Report

```text
====== EON FEASIBILITY ======

Average Busy Time: 8.50 hrs/day
Available Time: 7.50 hrs/day
Goal Time Needed: 3.25 hrs/day
Feasibility Score: 82%

GOALS APPEAR ACHIEVABLE
```

### 🗂️ Schedule Mappings (`plans.json`)

```json
{
    "option_1": {
        "Monday": [
            {
                "title": "Gym",
                "start": "08:00",
                "end": "09:00"
            },
            {
                "title": "Walk",
                "start": "17:00",
                "end": "18:00"
            }
        ]
    },
    "option_2": {
        "Monday": [
            {
                "title": "Walk",
                "start": "08:00",
                "end": "09:00"
            },
            {
                "title": "Gym",
                "start": "17:00",
                "end": "18:00"
            }
        ]
    }
}
```

---

## 15. Feasibility Score

The Feasibility Score represents the statistical likelihood of habit compliance. It is calculated dynamically:

$$\text{Busy Hours (Daily)} = \frac{\sum \text{Busy Event Durations (7 Days)}}{7 \times 60}$$

$$\text{Available Hours (Daily)} = 24 - \text{Sleep Hours} - \text{Busy Hours (Daily)}$$

$$\text{Goal Hours (Daily)} = \frac{\sum \text{Goal Durations (Daily)}}{60}$$

$$\text{Feasibility Score} = \min\left(100, \text{round}\left(\frac{\text{Available Hours (Daily)}}{\text{Goal Hours (Daily)}} \times 100\right)\right)$$

### Decision Logic Thresholds

| Threshold | Status | UI Color | Meaning |
| :--: | :--- | :--: | :--- |
| **≥ 70%** | Achievable | 🟢 Green | The engine assumes you have enough schedule buffer. |
| **< 70%** | Overload Detected | 🔴 Red / Orange | Warns the user that time limits are close, suggesting they scale down goals or sleep expectations. |

---

## 16. Scheduling Algorithm

EON utilizes a **Greedy Interval Packing** algorithm that runs day-by-day.

```text
For each Day:
  Get sorted Free Slots (by start time)
  Initialize current_time = slot_start
  For each Slot:
    While slot has remaining minutes and goals remain unscheduled:
      Get next Goal (name, duration)
      If duration <= remaining slot minutes:
        Schedule goal from current_time to (current_time + duration)
        Set current_time = current_time + duration
        Deduct duration from remaining slot minutes
        Mark Goal as scheduled for the day
      Else:
        Break (Goal doesn't fit in current slot, move to next Free Slot)
```

### Time Complexity

| Operation | Complexity |
| :--- | :--- |
| Sorting free slots | $O(N \log N)$ where $N$ is the number of events |
| Goal allocation loop | $O(S \times G)$ where $S$ is free slots and $G$ is configured goals |

Since $S \le 10$ and $G \le 10$ per day, execution completes in **< 5 milliseconds**.

---

## 17. Technologies Used

| Technology | Purpose | Why Chosen | Advantages |
| :--- | :--- | :--- | :--- |
| **Next.js 16** | Full-Stack UI | Integrated page routing and server APIs. | Rapid compilation, fast page responses. |
| **Python 3.10** | Core Engine | Native script execution and data processing. | Simple library support for API integration. |
| **Google Calendar API** | Calendar Source | Universal calendar syncing and storage. | Direct read/write, cloud persistence. |
| **Tailwind CSS 4** | Visual Styling | Modern typography, styling, and design. | Sleek aesthetics, zero runtime overhead. |
| **Ollama & Gemma 3** | AI Summarizer | Local execution of large language models. | Data privacy, runs locally without API keys. |
| **Framer Motion** | Animation UI | Smooth interface transitions and animations. | Premium feel, high-quality user engagement. |

---

## 18. Future Improvements

- [ ] **Agentic AI Replanning** — Incorporate automated agent loops to reschedule missed habits dynamically.
- [ ] **Google Fit & Apple Health Integrations** — Track actual workout completions using wearable telemetry.
- [ ] **Dynamic Sleep Budgets** — Adjust sleep targets automatically based on sleep ring metrics.
- [ ] **Multi-User Conflict Resolution** — Coordinate joint family workouts by comparing multiple calendars.
- [ ] **LLM Calendar Parsing** — Allow users to configure habits using natural language text prompts.
- [ ] **Predictive Scheduling** — Analyze historic habit failure rates to select peak success windows.

---

## 19. Research Opportunities

- **Clinical Compliance Studies** — Can be used to test whether calendar-integrated prompt schedules increase physical therapy compliance rates.
- **Chronotype Optimization** — Researching if evening vs morning gym session scheduling shows measurable differences in consistency.
- **Wellness Productization** — Excellent foundation for corporate wellness portals to optimize workspace life balance.

---

## 20. Known Limitations

| Limitation | Detail |
| :--- | :--- |
| **Google Sandbox Limits** | New developers must register emails in Google Console to authenticate client credentials. |
| **No Goal Splitting** | If a goal is 60 minutes, it requires a contiguous 60-minute free slot and won't split into two 30-minute slots. |
| **Single Timezone** | Relies on host timezone; cross-timezone travel planning is not supported yet. |

---

## 21. Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/NewFeature`.
3. Commit your changes: `git commit -m "feat: add user notification handler"`.
4. Push to branch: `git push origin feature/NewFeature`.
5. Open a Pull Request.

---

## 22. License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 23. Acknowledgements

- **EON Health** for providing the vision and requirements for this Proof of Concept.
- **Google Calendar Developer Team** for the comprehensive API v3 library support.
- **Ollama Community** for making Gemma models accessible on local developer rigs.

---

## 24. Contact

<div align="center">

**Developer:** Kumaraswamy G

[![Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Kumar070204/Goal-Feasibility-and-Life-Aware-Planning-Assistant)
[![Email](https://img.shields.io/badge/Email-kumar070204%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kumar070204@gmail.com)

</div>

---

<div align="center">
<sub>Built with care for EON Health — making wellness habits realistic, one calendar block at a time.</sub>
</div>
