"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Clock,
  Check,
  Send,
  Loader2,
  ChevronRight,
  Sun,
  Moon,
  Info,
} from "lucide-react";

interface Activity {
  title: string;
  start: string;
  end: string;
}

type PlanOption = Record<string, Activity[]>;

interface PlansData {
  option_1: PlanOption;
  option_2: PlanOption;
}

export default function SchedulePage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<PlansData | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"option_1" | "option_2">("option_1");

  const fetchPlans = async (isRegen = false) => {
    setLoading(true);
    try {
      const method = isRegen ? "POST" : "GET";
      const res = await fetch("/api/pipeline/schedule", { method });
      const data = await res.json();
      
      if (data.success && data.plans) {
        setPlans(data.plans);
        setAiExplanation(data.aiExplanation);
        if (isRegen) {
          toast({
            type: "success",
            title: "Schedules Re-generated",
            description: "New schedule variations compiled using latest goals.",
          });
        }
      } else {
        setPlans(null);
      }
    } catch (e: any) {
      toast({
        type: "error",
        title: "Load Error",
        description: "Failed to load schedule options.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSync = async (option: "option_1" | "option_2") => {
    setSyncing(option);
    try {
      const res = await fetch("/api/pipeline/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option }),
      });
      const data = await res.json();
      
      if (data.success) {
        setSyncSuccess(option);
        toast({
          type: "success",
          title: "Calendar Synchronized",
          description: data.message,
        });
        
        setTimeout(() => {
          setSyncSuccess(null);
        }, 4000);
      } else {
        toast({
          type: "error",
          title: "Sync Failed",
          description: data.error || "Subprocess execution failed.",
        });
      }
    } catch (e: any) {
      toast({
        type: "error",
        title: "Connection Error",
        description: e.message,
      });
    } finally {
      setSyncing(null);
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
        <p className="text-sm text-zinc-500">Generating optimal schedules...</p>
      </div>
    );
  }

  if (!plans) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="rounded-2xl border border-dashed border-[#22242b] p-12 max-w-md bg-zinc-900/10">
          <Calendar className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No Schedule Options Available</h3>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            EON needs your calendar analysis results before it can generate schedule options. Run the planning pipeline from the dashboard first.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-black hover:bg-zinc-200 transition"
          >
            Go to Dashboard <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Schedule Options</h1>
          <p className="mt-1 text-sm text-zinc-400">Review EON's custom weekly routines and choose one to sync.</p>
        </div>
        
        <button
          onClick={() => fetchPlans(true)}
          className="flex items-center gap-2 rounded-lg border border-[#22242b] bg-[#121316] hover:bg-[#1c1e24] px-4 py-2 text-xs font-semibold text-white transition"
        >
          <Loader2 className="h-3.5 w-3.5" /> Re-generate
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: AI explanation and selection tabs */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* EON AI Insights panel */}
          <div className="rounded-xl border border-sky-500/10 bg-sky-500/[0.02] glass-panel p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-sky-500/5 blur-3xl -z-10"></div>
            
            <div className="flex items-center gap-2 text-sky-400 font-semibold mb-3 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>EON AI Insights</span>
            </div>
            
            <div className="text-xs text-zinc-300 leading-relaxed space-y-3">
              {aiExplanation.split("\n\n").map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{ 
                  __html: para
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                }} />
              ))}
            </div>
          </div>

          {/* Sync Trigger Cards */}
          <div className="space-y-4">
            
            {/* Tab Selector Buttons */}
            <div className="flex rounded-lg bg-zinc-950 p-1 border border-[#202227]">
              <button
                onClick={() => setActiveTab("option_1")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-semibold transition ${
                  activeTab === "option_1" ? "bg-[#18191d] text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
                Morning Focus
              </button>
              <button
                onClick={() => setActiveTab("option_2")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-semibold transition ${
                  activeTab === "option_2" ? "bg-[#18191d] text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
                Evening Focus
              </button>
            </div>

            {/* Sync control block for Option 1 */}
            {activeTab === "option_1" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-[#202227] bg-[#111215] p-5 space-y-4"
              >
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <Sun className="h-4 w-4 text-amber-500" /> Morning Focused Plan
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Prioritizes heavy active routines (e.g. Walks/Gym sessions) in early mornings to build physical momentum.
                  </p>
                </div>
                
                {syncSuccess === "option_1" ? (
                  <div className="w-full rounded-lg bg-emerald-500/10 border border-emerald-500/20 py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
                    <Check className="h-4 w-4" /> Active on Calendar
                  </div>
                ) : (
                  <button
                    onClick={() => handleSync("option_1")}
                    disabled={syncing !== null}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition disabled:opacity-50"
                  >
                    {syncing === "option_1" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Choose & Sync Morning Plan
                  </button>
                )}
              </motion.div>
            )}

            {/* Sync control block for Option 2 */}
            {activeTab === "option_2" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-[#202227] bg-[#111215] p-5 space-y-4"
              >
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <Moon className="h-4 w-4 text-sky-400" /> Evening Focused Plan
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Reschedules physical active blocks into post-class evening intervals to help wind down.
                  </p>
                </div>

                {syncSuccess === "option_2" ? (
                  <div className="w-full rounded-lg bg-emerald-500/10 border border-emerald-500/20 py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
                    <Check className="h-4 w-4" /> Active on Calendar
                  </div>
                ) : (
                  <button
                    onClick={() => handleSync("option_2")}
                    disabled={syncing !== null}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition disabled:opacity-50"
                  >
                    {syncing === "option_2" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Choose & Sync Evening Plan
                  </button>
                )}
              </motion.div>
            )}
          </div>

        </div>

        {/* Right column: The calendar activities list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#202227] bg-[#111215] p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Weekly Schedule Details</h2>
            
            <div className="space-y-6">
              {days.map((day) => {
                const dayPlan = plans[activeTab]?.[day] || [];
                return (
                  <div key={day} className="border-b border-[#202227]/40 pb-4 last:border-0 last:pb-0">
                    <h4 className="text-xs font-bold text-zinc-400 tracking-wider uppercase mb-3">{day}</h4>
                    
                    {dayPlan.length === 0 ? (
                      <div className="rounded-lg bg-zinc-900/30 border border-dashed border-[#22242b] p-3 text-xs text-zinc-600 italic">
                        No custom goals scheduled (day is fully busy or goals fit in other slots)
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dayPlan.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-[#202227] bg-[#17181c] p-3 hover:border-zinc-700 transition"
                          >
                            <div className="flex items-center gap-3">
                              {/* Glowing circle indicator */}
                              <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                              </span>
                              <span className="text-sm font-semibold text-white">{activity.title}</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-zinc-500 font-medium text-xs">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{activity.start} - {activity.end}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
