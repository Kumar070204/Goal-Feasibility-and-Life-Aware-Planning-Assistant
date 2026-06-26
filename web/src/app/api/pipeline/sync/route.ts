import { NextResponse } from "next/server";
import { runPythonScript } from "@/lib/python-runner";

export async function POST(request: Request) {
  try {
    const { option } = await request.json();

    if (option !== "option_1" && option !== "option_2") {
      return NextResponse.json(
        { success: false, error: "Invalid schedule option selected" },
        { status: 400 }
      );
    }

    const result = await runPythonScript("schedule_option.py", [option]);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to sync ${option} to Google Calendar`,
          stderr: result.stderr,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Selected plan (${option === "option_1" ? "Morning Focused" : "Evening Focused"}) synced to Google Calendar!`,
      stdout: result.stdout,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
