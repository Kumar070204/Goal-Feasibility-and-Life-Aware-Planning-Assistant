"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Plus,
  Trash2,
  Sliders,
  Clock,
  LayoutGrid,
  Loader2,
  Activity,
  User,
  Coffee,
  Info,
} from "lucide-react";

interface Goal {
  title: string;
  duration: number; // in minutes
  color?: string;
  icon?: string;
}

export default function GoalsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sleepHours, setSleepHours] = useState<number>(8);
  
  // New goal form state
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState(30);
  const [newColor, setNewColor] = useState("#3b82f6");
  const [newIcon, setNewIcon] = useState("activity");

  const colors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Emerald", value: "#10b981" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Violet", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Sky", value: "#0ea5e9" },
    { name: "Indigo", value: "#6366f1" },
  ];

  const icons = ["activity", "dumbbell", "footprints", "book-open", "brain", "pen-tool", "flame", "laptop", "music", "coffee"];

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/goals");
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals || []);
        setSleepHours(data.sleep_hours || 8);
      }
    } catch {
      toast({
        type: "error",
        title: "Load Error",
        description: "Failed to load goals configurations.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSave = async (updatedGoals = goals, updatedSleep = sleepHours) => {
    setSaving(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sleep_hours: updatedSleep,
          goals: updatedGoals,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          type: "success",
          title: "Configurations Saved",
          description: "Your daily goals and sleep settings have been updated.",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      toast({
        type: "error",
        title: "Save Failed",
        description: e.message || "Failed to update configurations.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast({ type: "warning", title: "Validation Error", description: "Goal title is required." });
      return;
    }
    
    // Check duplication
    if (goals.some(g => g.title.toLowerCase() === newTitle.trim().toLowerCase())) {
      toast({ type: "warning", title: "Duplicate Goal", description: "A goal with this name already exists." });
      return;
    }

    const added: Goal = {
      title: newTitle.trim(),
      duration: newDuration,
      color: newColor,
      icon: newIcon,
    };

    const updated = [...goals, added];
    setGoals(updated);
    handleSave(updated, sleepHours);

    // Reset Form
    setNewTitle("");
    setNewDuration(30);
    setNewColor("#3b82f6");
    setNewIcon("activity");
  };

  const handleDeleteGoal = (titleToDelete: string) => {
    const updated = goals.filter(g => g.title !== titleToDelete);
    setGoals(updated);
    handleSave(updated, sleepHours);
  };

  const handleSleepChange = (val: number) => {
    setSleepHours(val);
    handleSave(goals, val);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
        <p className="text-sm text-zinc-500">Loading configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Goal Configuration</h1>
          <p className="mt-1 text-sm text-zinc-400">Define daily habits and sleep budgets EON should fit into your schedule.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Add goal and Sleep budget */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Sleep budget Card */}
          <div className="rounded-xl border border-[#202227] bg-[#111215] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Coffee className="h-5 w-5 text-indigo-400" /> Sleep Budget
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Allocating proper sleep hours determines how much remaining time EON has to schedule active goals.
            </p>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-semibold text-zinc-300">
                <span>Daily Sleep Hours</span>
                <span className="text-white font-bold">{sleepHours} Hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => handleSleepChange(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-zinc-800 accent-white cursor-pointer"
              />
            </div>
          </div>

          {/* Add Goal Card */}
          <div className="rounded-xl border border-[#202227] bg-[#111215] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-400" /> Add New Goal
            </h3>
            
            <form onSubmit={handleAddGoal} className="space-y-4">
              
              {/* Title input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Code, Practice Guitar"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-[#22242b] bg-[#090a0c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              {/* Duration input slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-400">Daily Duration</span>
                  <span className="text-white font-bold">{newDuration} Minutes</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={newDuration}
                  onChange={(e) => setNewDuration(parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-lg bg-zinc-800 accent-white cursor-pointer"
                />
              </div>

              {/* Color picker grid */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 block mb-1">Color Palette</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setNewColor(c.value)}
                      className={`h-6 w-6 rounded-full border border-zinc-950 transition-transform ${
                        newColor === c.value ? "scale-125 ring-2 ring-white/50" : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Add Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition disabled:opacity-50"
              >
                <Plus className="h-4 w-4" /> Add Goal
              </button>

            </form>
          </div>

        </div>

        {/* Right column: Active goals grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#202227] bg-[#111215] p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Active Habits ({goals.length})</h2>
            
            {goals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#22242b] rounded-lg bg-zinc-900/10">
                <Activity className="h-10 w-10 text-zinc-600 mb-3" />
                <h4 className="text-sm font-semibold text-zinc-300">No Habits Configured</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                  Add some goals using the form on the left to start building your EON routine schedule.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {goals.map((g) => (
                    <motion.div
                      key={g.title}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      className="rounded-xl border border-[#202227] bg-[#17181c] p-4 flex flex-col justify-between hover:border-zinc-700 transition relative overflow-hidden"
                    >
                      {/* Ambient color bar on top */}
                      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: g.color || "#3b82f6" }} />
                      
                      <div className="flex justify-between items-start pt-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="rounded-lg h-9 w-9 flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: `${g.color || "#3b82f6"}20`, color: g.color || "#3b82f6" }}
                          >
                            <span className="text-sm uppercase font-extrabold">{g.title.slice(0, 2)}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white leading-none">{g.title}</h4>
                            <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {g.duration} Minutes / day
                            </p>
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteGoal(g.title)}
                          disabled={saving}
                          className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-rose-400 transition"
                          title="Delete goal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {goals.length > 0 && (
              <div className="mt-6 p-4 rounded-lg bg-zinc-950/60 border border-[#202227] text-zinc-500 text-xs flex items-center gap-2.5">
                <Info className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                <span>Changes are autosaved. Regenerate your schedules from the dashboard or options page to apply edits.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
