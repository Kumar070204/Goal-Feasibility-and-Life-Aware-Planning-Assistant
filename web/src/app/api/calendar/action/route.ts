import { NextResponse } from "next/server";
import { runPythonScript } from "@/lib/python-runner";

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action === "setup-demo") {
      const result = await runPythonScript("calendar_simulator.py");
      return NextResponse.json({
        success: result.success,
        message: "Demo calendar generated successfully!",
        stdout: result.stdout,
        stderr: result.stderr,
      });
    }

    if (action === "cleanup") {
      const result = await runPythonScript("delete_all_simulations.py");
      return NextResponse.json({
        success: result.success,
        message: "Simulation calendar events cleared successfully!",
        stdout: result.stdout,
        stderr: result.stderr,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
