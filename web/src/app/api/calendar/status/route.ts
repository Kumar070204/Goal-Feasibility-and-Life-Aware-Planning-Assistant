import { NextResponse } from "next/server";
import fs from "fs";
import { getBackendFilePath } from "@/lib/python-runner";

export async function GET() {
  const tokenPath = getBackendFilePath("token.pkl");
  const credentialsPath = getBackendFilePath("credentials.json");

  const hasToken = fs.existsSync(tokenPath);
  const hasCredentials = fs.existsSync(credentialsPath);

  let tokenSize = 0;
  if (hasToken) {
    try {
      tokenSize = fs.statSync(tokenPath).size;
    } catch {}
  }

  return NextResponse.json({
    connected: hasToken && hasCredentials,
    hasToken,
    hasCredentials,
    tokenSize,
  });
}
