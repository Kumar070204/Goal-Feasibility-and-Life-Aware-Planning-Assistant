import { NextResponse } from "next/server";
import fs from "fs";
import { getBackendFilePath } from "@/lib/python-runner";

const defaultGoalsData = {
  sleep_hours: 8,
  goals: [
    { title: "Gym", duration: 60, color: "#3b82f6", icon: "dumbbell" },
    { title: "Walk", duration: 60, color: "#10b981", icon: "footprints" },
    { title: "Read", duration: 30, color: "#f59e0b", icon: "book-open" },
    { title: "Meditate", duration: 20, color: "#8b5cf6", icon: "brain" },
    { title: "Journal", duration: 15, color: "#ec4899", icon: "pen-tool" }
  ]
};

export async function GET() {
  const filePath = getBackendFilePath("goals.json");

  if (!fs.existsSync(filePath)) {
    // Return default goals config if goals.json is missing
    return NextResponse.json(defaultGoalsData);
  }

  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);
    
    // Ensure structure is correct
    if (!data.goals || !Array.isArray(data.goals)) {
      data.goals = defaultGoalsData.goals;
    }
    if (typeof data.sleep_hours !== "number") {
      data.sleep_hours = defaultGoalsData.sleep_hours;
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(defaultGoalsData);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const filePath = getBackendFilePath("goals.json");

    if (!data.goals || !Array.isArray(data.goals)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid goals array" },
        { status: 400 }
      );
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "Goals saved successfully!" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
