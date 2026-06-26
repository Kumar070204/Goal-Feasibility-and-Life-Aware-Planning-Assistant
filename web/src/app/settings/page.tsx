"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders,
  Terminal,
  Shield,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Key,
} from "lucide-react";

interface LogEntry {
  timestamp: string;
  command: string;
  code: number | null;
  stdout: string;
  stderr: string;
}

interface CalendarStatus {
  connected: boolean;
  hasToken: boolean;
  hasCredentials: boolean;
  tokenSize: number;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [status, setStatus] = useState<CalendarStatus>({
    connected: false,
    hasToken: false,
    hasCredentials: false,
    tokenSize: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const statusRes = await fetch("/api/calendar/status");
      if (statusRes.ok) {
        setStatus(await statusRes.json());
      }
      
      const logsRes = await fetch("/api/logs");
      if (logsRes.ok) {
        const data = await logsRes.json();
        // Sort logs to show latest on top
        setLogs((data.logs || []).reverse());
      }
    } catch {
      toast({
        type: "error",
        title: "Load Error",
        description: "Failed to fetch logs or auth status.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClearLogs = async () => {
    try {
      const res = await fetch("/api/logs", { method: "DELETE" });
      if (res.ok) {
        setLogs([]);
        toast({ type: "success", title: "Logs Cleared", description: "Terminal execution logs removed." });
      }
    } catch {}
  };

  const toggleExpandLog = (index: number) => {
    setExpandedLog(expandedLog === index ? null : index);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System Settings & Logs</h1>
          <p className="mt-1 text-sm text-zinc-400">Audit calendar credentials and monitor python engine execution logs.</p>
        </div>
        
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 rounded-lg border border-[#22242b] bg-[#121316] hover:bg-[#1c1e24] px-4 py-2 text-xs font-semibold text-white transition"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Auth audits */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Calendar Credential Status */}
          <div className="rounded-xl border border-[#202227] bg-[#111215] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-sky-400" /> Google Calendar Integration
            </h3>
            
            <div className="space-y-4 pt-2">
              {/* Overall status */}
              <div className="flex justify-between items-center border-b border-[#202227]/40 pb-3">
                <span className="text-xs text-zinc-400">Connection State</span>
                <span className={`rounded px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                  status.connected 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  {status.connected ? "Authorized" : "Unauthorized"}
                </span>
              </div>

              {/* credentials.json check */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">credentials.json File</span>
                <span className="flex items-center gap-1.5 font-bold">
                  {status.hasCredentials ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-emerald-500" /> Present
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-500" /> Missing
                    </>
                  )}
                </span>
              </div>

              {/* token.pkl check */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">token.pkl OAuth Token</span>
                <span className="flex items-center gap-1.5 font-bold">
                  {status.hasToken ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-emerald-500" /> Active ({Math.round(status.tokenSize / 100) / 10} KB)
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-500" /> Missing
                    </>
                  )}
                </span>
              </div>
            </div>
            
            {!status.connected && (
              <div className="rounded-lg bg-zinc-950 p-3.5 border border-[#22242b] text-[11px] text-zinc-400 leading-relaxed space-y-2">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Key className="h-3.5 w-3.5" /> Action Required
                </div>
                <p>
                  To enable Google Calendar syncing, make sure your OAuth credentials are saved as `credentials.json` and client tokens are authenticated in the `token.pkl` store.
                </p>
              </div>
            )}
          </div>

          {/* SaaS Details */}
          <div className="rounded-xl border border-[#202227] bg-[#111215] p-6 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-indigo-400" /> System Details
            </h3>
            <div className="text-xs text-zinc-500 space-y-2 pt-2">
              <div className="flex justify-between"><span className="text-zinc-400">Model Engine</span> <span className="font-mono text-zinc-300">gemma3:4b (Ollama)</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Node Engine</span> <span className="font-mono text-zinc-300">v22.16.0</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Python Interpreter</span> <span className="font-mono text-zinc-300">Python 3.12.7</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Framework</span> <span className="font-mono text-zinc-300">Next.js 16.2 (App Router)</span></div>
            </div>
          </div>

        </div>

        {/* Right Side: Execution Monospace Terminal logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#202227] bg-[#111215] p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-zinc-400" /> Execution Console Logs
                </h2>
                <p className="text-xs text-zinc-500 mt-1">Python subprocess runtimes audit dashboard</p>
              </div>
              
              {logs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="flex items-center gap-1 rounded bg-rose-500/10 text-rose-400 text-xs font-semibold py-1.5 px-3 hover:bg-rose-500/20 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear Console
                </button>
              )}
            </div>

            {/* Logs List Console */}
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-[#22242b] rounded-lg bg-zinc-900/10">
                <Terminal className="h-10 w-10 text-zinc-700 mb-3" />
                <h4 className="text-sm font-semibold text-zinc-400">Console is Empty</h4>
                <p className="text-xs text-zinc-600 mt-1">Logs will appear here once you run syncing or analysis actions.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {logs.map((log, index) => {
                  const isExpanded = expandedLog === index;
                  const dateStr = new Date(log.timestamp).toLocaleTimeString();
                  
                  return (
                    <div
                      key={index}
                      className="rounded-lg border border-[#202227] bg-[#08090a] overflow-hidden"
                    >
                      {/* Log Header Row */}
                      <button
                        onClick={() => toggleExpandLog(index)}
                        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-zinc-950 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-2 w-2 rounded-full ${log.code === 0 ? "bg-emerald-400" : "bg-rose-400"}`} />
                          <span className="font-mono text-xs font-bold text-zinc-300">{log.command}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span className="font-mono">{dateStr}</span>
                          <span className={`text-[10px] font-bold rounded px-1.5 py-0.5 ${
                            log.code === 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                          }`}>
                            Exit: {log.code}
                          </span>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </button>

                      {/* Expandable outputs console log body */}
                      {isExpanded && (
                        <div className="border-t border-[#202227] bg-[#0c0d10] p-4 font-mono text-[10px] space-y-3 overflow-x-auto">
                          {log.stdout && (
                            <div>
                              <div className="text-emerald-400 font-bold mb-1">[STDOUT]</div>
                              <pre className="text-zinc-300 bg-zinc-950 p-2.5 rounded border border-[#202227] max-w-full overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                {log.stdout}
                              </pre>
                            </div>
                          )}
                          
                          {log.stderr && (
                            <div>
                              <div className="text-rose-400 font-bold mb-1">[STDERR]</div>
                              <pre className="text-rose-300 bg-rose-950/20 p-2.5 rounded border border-rose-500/20 max-w-full overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                {log.stderr}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
