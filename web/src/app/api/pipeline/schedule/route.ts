import { NextResponse } from "next/server";
import fs from "fs";
import { runPythonScript, getBackendFilePath } from "@/lib/python-runner";

export async function GET() {
  const plansPath = getBackendFilePath("plans.json");
  if (!fs.existsSync(plansPath)) {
    return NextResponse.json({
      success: false,
      plans: null,
      aiExplanation: "No plans generated yet.",
    });
  }
  try {
    const plans = JSON.parse(fs.readFileSync(plansPath, "utf-8"));
    const aiExplanation = generateFallbackExplanation(plans);
    return NextResponse.json({ success: true, plans, aiExplanation });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // 1. Run smart scheduler
    const schedulerResult = await runPythonScript("smart_scheduler.py");
    if (!schedulerResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate schedule options",
          stderr: schedulerResult.stderr,
        },
        { status: 500 }
      );
    }

    // 2. Read plans.json
    let plans = {};
    const plansPath = getBackendFilePath("plans.json");
    if (fs.existsSync(plansPath)) {
      try {
        plans = JSON.parse(fs.readFileSync(plansPath, "utf-8"));
      } catch (e) {
        console.error("Error parsing plans.json:", e);
      }
    }

    // 3. Try to run plan_explainer.py for AI explanation
    let aiExplanation = "";
    try {
      const explainerResult = await runPythonScript("plan_explainer.py");
      if (explainerResult.success && explainerResult.stdout.trim()) {
        aiExplanation = explainerResult.stdout.trim();
      } else {
        console.warn("Ollama explainer returned error or empty. Generating smart fallback.");
        aiExplanation = generateFallbackExplanation(plans);
      }
    } catch (e) {
      console.error("Error executing plan_explainer.py:", e);
      aiExplanation = generateFallbackExplanation(plans);
    }

    return NextResponse.json({
      success: true,
      plans,
      aiExplanation,
      rawSchedulerOutput: schedulerResult.stdout,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function generateFallbackExplanation(plans: any): string {
  if (!plans || (!plans.option_1 && !plans.option_2)) {
    return "No schedule plans generated yet. Complete the analysis step to check calendar availability.";
  }

  return (
    "**Morning Focused (Option 1)** allocates your high-energy physical goals (like Walk and Gym) into the first available free blocks of the day (typically starting from 06:00 AM). This is recommended for early risers who want to build immediate daily momentum.\n\n" +
    "**Evening Focused (Option 2)** reorganizes these priorities, placing your Gym workouts and walks in your post-college/post-work evening slots (often starting from 17:00 PM onwards). This is ideal if you prefer using physical activity to unwind after a busy daytime schedule."
  );
}
