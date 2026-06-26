"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Activity,
  Sparkles,
  Clock,
  Trash2,
  Play,
  RotateCw,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

interface Metrics {
  averageBusyHours: number;
  availableHours: number;
  goalNeededHours: number;
  feasibilityScore: number;
}

interface Goal {
  title: string;
  duration: number;
  color?: string;
}

export default function Dashboard() {
  const { toast } = useToast();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [pipelineState, setPipelineState] = useState<"idle" | "running" | "success" | "error">("idle");
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  
  // States loaded from backend
  const [metrics, setMetrics] = useState<Metrics>({
    averageBusyHours: 9.75,
    availableHours: 6.25,
    goalNeededHours: 3.08,
    feasibilityScore: 100,
  });
  const [slots, setSlots] = useState<Record<string, [string, string][]>>({});
  const [goals, setGoals] = useState<Goal[]>([]);
  const [calStatus, setCalStatus] = useState({ connected: false });

  // Initial fetch of goals and status
  const fetchData = async () => {
    try {
      const statusRes = await fetch("/api/calendar/status");
      if (statusRes.ok) {
        const data = await statusRes.json();
        setCalStatus({ connected: data.connected });
      }

      const goalsRes = await fetch("/api/goals");
      if (goalsRes.ok) {
        const data = await goalsRes.json();
        setGoals(data.goals || []);
        setMetrics(prev => ({
          ...prev,
          goalNeededHours: (data.goals.reduce((acc: number, g: any) => acc + g.duration, 0) / 60)
        }));
      }
    } catch {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Trigger Google Calendar setup/cleanup
  const runCalendarAction = async (action: "setup-demo" | "cleanup") => {
    setLoadingAction(action);
    try {
      const res = await fetch("/api/calendar/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast({
          type: "success",
          title: "Calendar Action Successful",
          description: data.message,
        });
        fetchData();
      } else {
        toast({
          type: "error",
          title: "Action Failed",
          description: data.error || "Calendar script execution failed.",
        });
      }
    } catch (e: any) {
      toast({
        type: "error",
        title: "Connection Error",
        description: e.message,
      });
    } finally {
      setLoadingAction(null);
    }
  };

  // Run the full Replanning pipeline (Analyze -> Feasibility -> Smart Scheduler)
  const runPlanningPipeline = async () => {
    setPipelineState("running");
    setPipelineStep(1); // Step 1: Calendar analysis

    try {
      // 1. Run Calendar Analysis & Feasibility Check
      const analyzeRes = await fetch("/api/pipeline/analyze", { method: "POST" });
      if (!analyzeRes.ok) {
        throw new Error("Calendar slot finder or feasibility check failed.");
      }
      const analyzeData = await analyzeRes.json();
      
      if (!analyzeData.success) {
        throw new Error(analyzeData.error || "Failed to analyze calendar.");
      }

      setMetrics(analyzeData.metrics);
      setSlots(analyzeData.slots);
      
      setPipelineStep(2); // Step 2: Generates schedule plans

      const scheduleRes = await fetch("/api/pipeline/schedule", { method: "POST" });
      if (!scheduleRes.ok) {
        throw new Error("Smart scheduling generation failed.");
      }
      const scheduleData = await scheduleRes.json();

      if (!scheduleData.success) {
        throw new Error(scheduleData.error || "Failed to generate schedules.");
      }

      setPipelineState("success");
      toast({
        type: "success",
        title: "Planning Complete",
        description: `Analysis & feasibility complete. Generated 2 plans! Feasibility score is ${analyzeData.metrics.feasibilityScore}%.`,
      });
    } catch (err: any) {
      setPipelineState("error");
      toast({
        type: "error",
        title: "Pipeline Failed",
        description: err.message,
      });
    }
  };

  // Helper formatting for durations
  const formatHours = (hours: number) => {
    const hrs = Math.floor(hours);
    const mins = Math.round((hours - hrs) * 60);
    return `${hrs}h ${mins}m`;
  };

  // Feasibility color theme helper
  const getFeasibilityColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500 bg-emerald-500/10";
    if (score >= 60) return "text-amber-500 stroke-amber-500 bg-amber-500/10";
    return "text-rose-500 stroke-rose-500 bg-rose-500/10";
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">EON Life Aware Planning</h1>
          <p className="mt-2 text-zinc-400 text-sm md:text-base">
            Optimize your daily fitness and lifestyle goals around your real commitments.
          </p>
        </div>
        
        {/* Pipeline action button */}
        <button
          onClick={runPlanningPipeline}
          disabled={pipelineState === "running"}
          className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-black transition-all shadow-lg hover:shadow-xl ${
            pipelineState === "running"
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-white hover:bg-zinc-200"
          }`}
        >
          {pipelineState === "running" ? (
            <RotateCw className="h-5 w-5 animate-spin" />
          ) : (
            <Play className="h-5 w-5 fill-current" />
          )}
          {pipelineState === "running" ? "Running Pipeline..." : "Sync & Replan"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Total Goals */}
        <div className="rounded-xl border border-[#202227] bg-[#111215] p-6 transition-all hover:border-zinc-700">
          <div className="flex justify-between items-start">
            <span className="text-sm text-zinc-400 font-medium">Active Goals</span>
            <div className="rounded-lg bg-zinc-800/50 p-2 text-zinc-300">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-white">{goals.length}</h3>
            <p className="mt-1 text-xs text-zinc-500">Configured in manager</p>
          </div>
        </div>

        {/* Card 2: Daily Goal Time */}
        <div className="rounded-xl border border-[#202227] bg-[#111215] p-6 transition-all hover:border-zinc-700">
          <div className="flex justify-between items-start">
            <span className="text-sm text-zinc-400 font-medium">Daily Goal Time</span>
            <div className="rounded-lg bg-zinc-800/50 p-2 text-zinc-300">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-white">{formatHours(metrics.goalNeededHours)}</h3>
            <p className="mt-1 text-xs text-zinc-500">Sum of goal durations</p>
          </div>
        </div>

        {/* Card 3: Free Available Time */}
        <div className="rounded-xl border border-[#202227] bg-[#111215] p-6 transition-all hover:border-zinc-700">
          <div className="flex justify-between items-start">
            <span className="text-sm text-zinc-400 font-medium">Free Available Time</span>
            <div className="rounded-lg bg-zinc-800/50 p-2 text-zinc-300">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-white">{formatHours(metrics.availableHours)}</h3>
            <p className="mt-1 text-xs text-zinc-500">Average weekly free slots</p>
          </div>
        </div>

        {/* Card 4: Feasibility Score */}
        <div className="rounded-xl border border-[#202227] bg-[#111215] p-6 transition-all hover:border-zinc-700 flex items-center justify-between">
          <div>
            <span className="text-sm text-zinc-400 font-medium block">Planning Feasibility</span>
            <h3 className="mt-4 text-3xl font-extrabold text-white">{metrics.feasibilityScore}%</h3>
            <p className="mt-1 text-xs text-zinc-500">Available vs Goal Hours</p>
          </div>
          
          {/* Radial progress ring */}
          <div className="relative h-16 w-16">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path
                className="stroke-zinc-800"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${metrics.feasibilityScore}, 100` }}
                transition={{ duration: 1 }}
                className={getFeasibilityColor(metrics.feasibilityScore).split(" ")[1]}
                strokeWidth="3.5"
                strokeDasharray="82, 100"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Section layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Pipeline states and Quick Calendar control */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Pipeline Tracker */}
          <div className="rounded-xl border border-[#202227] bg-[#111215] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Pipeline Status</h2>
            
            <div className="space-y-5">
              {/* Step 1: Calendar analysis */}
              <div className="flex items-center gap-3">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  pipelineStep >= 1
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-zinc-500"
                }`}>
                  1
                </div>
                <div>
                  <h4 className={`text-sm font-semibold ${pipelineStep >= 1 ? "text-white" : "text-zinc-500"}`}>
                    Calendar Analysis
                  </h4>
                  <p className="text-xs text-zinc-500">Retrieves busy/free slots</p>
                </div>
                {pipelineState === "running" && pipelineStep === 1 && (
                  <RotateCw className="h-4 w-4 animate-spin text-zinc-400 ml-auto" />
                )}
                {pipelineStep > 1 && (
                  <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto" />
                )}
              </div>

              {/* Step 2: Feasibility & Scheduler */}
              <div className="flex items-center gap-3">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  pipelineStep >= 2
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-zinc-500"
                }`}>
                  2
                </div>
                <div>
                  <h4 className={`text-sm font-semibold ${pipelineStep >= 2 ? "text-white" : "text-zinc-500"}`}>
                    Dynamic Scheduler
                  </h4>
                  <p className="text-xs text-zinc-500">Fills slots with priority</p>
                </div>
                {pipelineState === "running" && pipelineStep === 2 && (
                  <RotateCw className="h-4 w-4 animate-spin text-zinc-400 ml-auto" />
                )}
                {pipelineState === "success" && (
                  <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto" />
                )}
              </div>
            </div>

            {/* Pipeline State Banner */}
            {pipelineState === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4 flex-shrink-0" />
                <span>Plans compiled successfully! Navigate to **Schedule Options** to view and sync them.</span>
              </motion.div>
            )}
            
            {pipelineState === "error" && (
              <div className="mt-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>Errors occurred during pipeline script execution. Check developer settings logs.</span>
              </div>
            )}
          </div>

          {/* Quick Calendar control card */}
          <div className="rounded-xl border border-[#202227] bg-[#111215] p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Google Calendar Sandbox</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Populate your Google Calendar with a simulated, busy lifestyle (college classes, club activities, dinner) to verify how EON plans around them.
            </p>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => runCalendarAction("setup-demo")}
                disabled={loadingAction !== null}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-[#22242b] bg-[#18191d] py-2 px-3 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition"
              >
                {loadingAction === "setup-demo" ? (
                  <RotateCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Calendar className="h-3.5 w-3.5" />
                )}
                Load Demo Events
              </button>
              
              <button
                onClick={() => runCalendarAction("cleanup")}
                disabled={loadingAction !== null}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-[#22242b] bg-rose-500/10 text-rose-400 py-2 px-3 text-xs font-semibold hover:bg-rose-500/20 disabled:opacity-50 transition"
              >
                {loadingAction === "cleanup" ? (
                  <RotateCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Clear Simulation
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Calendar Grid (The slots analysis) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#202227] bg-[#111215] p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Calendar Slot Allocation</h2>
                <p className="text-xs text-zinc-500 mt-1">Identified free blocks from 06:00 to 23:00</p>
              </div>
              <div className="flex gap-4 text-xs font-medium text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-zinc-800 border border-[#22242b]"></span> Busy
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-sky-500/20 border border-sky-500/40"></span> Free Slot
                </span>
              </div>
            </div>

            {/* Empty state or visualization grid */}
            {Object.keys(slots).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#22242b] rounded-lg bg-zinc-900/10">
                <Calendar className="h-10 w-10 text-zinc-600 mb-3" />
                <h4 className="text-sm font-semibold text-zinc-300">No Calendar Analysis Found</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                  Run the replanning pipeline to query your primary calendar, find available free slots, and render the grid.
                </p>
                <button
                  onClick={runPlanningPipeline}
                  className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-200 transition"
                >
                  Analyze Calendar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {daysOfWeek.map((day) => {
                  const daySlots = slots[day] || [];
                  return (
                    <div key={day} className="grid grid-cols-12 gap-3 items-center">
                      {/* Day Label */}
                      <span className="col-span-2 text-xs font-semibold text-zinc-300">{day}</span>
                      
                      {/* Time timeline visual block */}
                      <div className="col-span-10 h-7 w-full rounded-lg bg-zinc-900/60 border border-[#202227] relative overflow-hidden flex">
                        {daySlots.length === 0 ? (
                          // Fully busy day
                          <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-[10px] text-zinc-600">
                            Occupied (No Free Slots Found)
                          </div>
                        ) : (
                          // Overlay slots
                          // We map hours from 06:00 to 23:00 (17 hours total)
                          // Convert slots to relative percentage widths
                          daySlots.map((slot, index) => {
                            const [start, end] = slot;
                            const [startH, startM] = start.split(":").map(Number);
                            const [endH, endM] = end.split(":").map(Number);
                            
                            const startMins = (startH - 6) * 60 + startM;
                            const endMins = (endH - 6) * 60 + endM;
                            const totalMins = 17 * 60; // 06:00 to 23:00
                            
                            const leftPercent = Math.max(0, (startMins / totalMins) * 100);
                            const widthPercent = Math.min(100, ((endMins - startMins) / totalMins) * 100);
                            
                            return (
                              <div
                                key={index}
                                className="absolute top-0 bottom-0 bg-sky-500/15 border-l border-r border-sky-400/40 flex items-center justify-center text-[9px] font-bold text-sky-400 cursor-help"
                                style={{
                                  left: `${leftPercent}%`,
                                  width: `${widthPercent}%`,
                                }}
                                title={`Available: ${start} - ${end}`}
                              >
                                {widthPercent > 8 && `${start}-${end}`}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* Timeline Axis Labels */}
                <div className="grid grid-cols-12 gap-3 pt-2 text-[10px] text-zinc-600 font-semibold border-t border-[#202227] mt-4">
                  <span className="col-span-2"></span>
                  <div className="col-span-10 flex justify-between px-1">
                    <span>06:00 AM</span>
                    <span>10:00 AM</span>
                    <span>02:00 PM</span>
                    <span>06:00 PM</span>
                    <span>11:00 PM</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
