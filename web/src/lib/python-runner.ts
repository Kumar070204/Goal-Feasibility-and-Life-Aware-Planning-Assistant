import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export interface SubprocessResult {
  success: boolean;
  code: number | null;
  stdout: string;
  stderr: string;
}

const EON_POC_DIR = path.resolve(process.cwd(), "../EON_POC");

export function getBackendFilePath(filename: string): string {
  return path.join(EON_POC_DIR, filename);
}

export function runPythonScript(
  scriptName: string,
  args: string[] = []
): Promise<SubprocessResult> {
  return new Promise((resolve) => {
    const scriptPath = path.join(EON_POC_DIR, scriptName);
    
    // Log executing commands
    const commandStr = `python ${scriptName} ${args.join(" ")}`;
    console.log(`[PythonRunner] Running: ${commandStr} in ${EON_POC_DIR}`);
    
    // Spawn python process
    const pyProcess = spawn("python", [scriptName, ...args], {
      cwd: EON_POC_DIR,
      env: { ...process.env, PYTHONUNBUFFERED: "1" }
    });

    let stdout = "";
    let stderr = "";

    pyProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    pyProcess.on("close", (code) => {
      const success = code === 0;
      console.log(`[PythonRunner] Completed: ${scriptName} with code ${code}`);
      
      // Save debug log history inside a local file for the UI console logs tab
      appendExecutionLog(commandStr, code, stdout, stderr);
      
      resolve({
        success,
        code,
        stdout,
        stderr,
      });
    });

    pyProcess.on("error", (err) => {
      console.error(`[PythonRunner] Spawn error:`, err);
      resolve({
        success: false,
        code: -1,
        stdout: "",
        stderr: err.message,
      });
    });
  });
}

// Log execution history to a file so that users can inspect what commands were run in the dashboard Settings/Logs
const LOG_FILE = path.join(EON_POC_DIR, "execution_logs.json");

interface LogEntry {
  timestamp: string;
  command: string;
  code: number | null;
  stdout: string;
  stderr: string;
}

function appendExecutionLog(command: string, code: number | null, stdout: string, stderr: string) {
  try {
    let logs: LogEntry[] = [];
    if (fs.existsSync(LOG_FILE)) {
      const data = fs.readFileSync(LOG_FILE, "utf-8");
      logs = JSON.parse(data);
    }
    
    logs.push({
      timestamp: new Date().toISOString(),
      command,
      code,
      stdout,
      stderr
    });
    
    // Limit to last 50 logs
    if (logs.length > 50) {
      logs = logs.slice(logs.length - 50);
    }
    
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to execution logs:", err);
  }
}

export function getExecutionLogs(): LogEntry[] {
  try {
    if (fs.existsSync(LOG_FILE)) {
      return JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"));
    }
  } catch {}
  return [];
}

export function clearExecutionLogs() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      fs.unlinkSync(LOG_FILE);
    }
  } catch {}
}
