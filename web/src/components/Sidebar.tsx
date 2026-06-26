"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  Target,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Zap,
  Activity,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [calStatus, setCalStatus] = useState<{ connected: boolean; hasToken: boolean }>({
    connected: false,
    hasToken: false,
  });

  useEffect(() => {
    // Fetch google calendar status on load
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/calendar/status");
        if (res.ok) {
          const data = await res.json();
          setCalStatus({ connected: data.connected, hasToken: data.hasToken });
        }
      } catch {}
    };
    fetchStatus();
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Schedule Options", href: "/schedule", icon: CalendarDays },
    { name: "Goal Configuration", href: "/goals", icon: Target },
    { name: "Settings & Logs", href: "/settings", icon: Sliders },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen border-r border-[#22242b] bg-[#090a0c] transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand logo header */}
      <div className="flex h-16 items-center gap-2 border-b border-[#22242b] px-4 font-bold tracking-tight text-white">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black shadow-md">
          <Zap className="h-4 w-4" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
          >
            EON LIFE ENGINE
          </motion.span>
        )}
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-1.5 px-3 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="block relative">
              <div
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#18191d] text-white"
                    : "text-zinc-400 hover:bg-[#111215] hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-zinc-400"}`} />
                {!collapsed && <span>{item.name}</span>}
                
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-white"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Google Calendar status indicator footer */}
      <div className="border-t border-[#22242b] p-4 bg-[#08090a]">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                calStatus.connected ? "bg-emerald-400" : "bg-rose-400"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                calStatus.connected ? "bg-emerald-500" : "bg-rose-500"
              }`}
            ></span>
          </div>
          {!collapsed && (
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-white">Google Calendar</span>
              <span className="text-[10px] text-zinc-400">
                {calStatus.connected ? "Connected" : "Disconnected"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse/Expand Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[#22242b] bg-[#0c0d0f] text-zinc-400 hover:text-white shadow transition-transform"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
