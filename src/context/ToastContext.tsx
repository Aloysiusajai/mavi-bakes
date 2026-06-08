"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
};

type ToastContextValue = {
  showToast: (t: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (t: Omit<Toast, "id">) => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const toast: Toast = { id, title: t.title, description: t.description, duration: t.duration ?? 3000 };
    setToasts((s) => [toast, ...s]);
    // auto dismiss
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), toast.duration);
    return id;
  };

  const dismiss = (id: string) => setToasts((s) => s.filter((x) => x.id !== id));

  const value = useMemo(() => ({ showToast, dismiss }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-6 bottom-6 z-[9999] flex flex-col gap-3 items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 600, damping: 30 }}
              className="max-w-sm w-full bg-white/95 dark:bg-[rgba(255,255,255,0.06)] text-chocolate rounded-lg p-4 shadow-lg border border-[rgba(90,47,43,0.04)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  {t.title ? <div className="font-bold mb-1">{t.title}</div> : null}
                  {t.description ? <div className="text-sm text-chocolate/70">{t.description}</div> : null}
                </div>
                <button onClick={() => dismiss(t.id)} aria-label="Dismiss toast" className="text-chocolate/50 hover:text-chocolate">
                  ×
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
