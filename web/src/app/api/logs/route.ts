import { NextResponse } from "next/server";
import { getExecutionLogs, clearExecutionLogs } from "@/lib/python-runner";

export async function GET() {
  const logs = getExecutionLogs();
  return NextResponse.json({ logs });
}

export async function DELETE() {
  clearExecutionLogs();
  return NextResponse.json({ success: true, message: "Logs cleared" });
}
