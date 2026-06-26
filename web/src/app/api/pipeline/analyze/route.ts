import { NextResponse } from "next/server";
import fs from "fs";
import { runPythonScript, getBackendFilePath } from "@/lib/python-runner";

export async function POST() {
  try {
    // 1. Run free slot finder
    const slotFinderResult = await runPythonScript("free_slot_finder.py");
    if (!slotFinderResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to analyze calendar slots",
          stderr: slotFinderResult.stderr,
        },
        { status: 500 }
      );
    }

    // 2. Run feasibility engine
    const feasibilityResult = await runPythonScript("feasibility_engine.py");
    if (!feasibilityResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to calculate feasibility score",
          stderr: feasibilityResult.stderr,
        },
        { status: 500 }
      );
    }

    // 3. Load slots.json
    let slots = {};
    const slotsPath = getBackendFilePath("slots.json");
    if (fs.existsSync(slotsPath)) {
      try {
        slots = JSON.parse(fs.readFileSync(slotsPath, "utf-8"));
      } catch (e) {
        console.error("Error parsing slots.json:", e);
      }
    }

    // 4. Parse feasibility metrics from stdout
    const stdout = feasibilityResult.stdout;
    
    const avgBusyMatch = stdout.match(/Average Busy Time:\s+([\d.]+)\s+hrs\/day/i);
    const availableMatch = stdout.match(/Available Time:\s+([\d.]+)\s+hrs\/day/i);
    const goalNeededMatch = stdout.match(/Goal Time Needed:\s+([\d.]+)\s+hrs\/day/i);
    const scoreMatch = stdout.match(/Feasibility Score:\s+(\d+)%/i);

    const averageBusyHours = avgBusyMatch ? parseFloat(avgBusyMatch[1]) : 0;
    const availableHours = availableMatch ? parseFloat(availableMatch[1]) : 0;
    const goalNeededHours = goalNeededMatch ? parseFloat(goalNeededMatch[1]) : 0;
    const feasibilityScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    return NextResponse.json({
      success: true,
      metrics: {
        averageBusyHours,
        availableHours,
        goalNeededHours,
        feasibilityScore,
      },
      slots,
      rawFinderOutput: slotFinderResult.stdout,
      rawFeasibilityOutput: feasibilityResult.stdout,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
