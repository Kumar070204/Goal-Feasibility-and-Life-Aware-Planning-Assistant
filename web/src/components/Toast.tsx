"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (props: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback(({ type, title, description, duration = 4000 }: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-[#22242b] bg-[#121316]/95 p-4 shadow-xl backdrop-blur-md"
            >
              {/* Type icon */}
              <div className="mt-0.5">
                {t.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                {t.type === "error" && <XCircle className="h-5 w-5 text-rose-500" />}
                {t.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                {t.type === "info" && <Info className="h-5 w-5 text-sky-500" />}
              </div>

              {/* Text content */}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white">{t.title}</h4>
                {t.description && (
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{t.description}</p>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => removeToast(t.id)}
                className="rounded p-0.5 text-zinc-500 hover:bg-zinc-800 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
