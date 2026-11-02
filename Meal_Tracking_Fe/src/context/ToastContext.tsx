'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string, duration = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastMessage = { id, type, title, message, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg: string, title?: string) => addToast('success', msg, title),
    error: (msg: string, title?: string) => addToast('error', msg, title),
    warning: (msg: string, title?: string) => addToast('warning', msg, title),
    info: (msg: string, title?: string) => addToast('info', msg, title),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}

      {/* Floating Toast Container */}
      <div
        aria-live="assertive"
        className="fixed top-5 right-5 z-50 flex max-w-sm w-full flex-col space-y-3 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-4 fade-in ${
              t.type === 'success'
                ? 'border-emerald-200 bg-white/95 text-emerald-950 dark:border-emerald-900/60 dark:bg-slate-900/95 dark:text-emerald-100 shadow-emerald-500/10'
                : t.type === 'error'
                ? 'border-rose-200 bg-white/95 text-rose-950 dark:border-rose-900/60 dark:bg-slate-900/95 dark:text-rose-100 shadow-rose-500/10'
                : t.type === 'warning'
                ? 'border-amber-200 bg-white/95 text-amber-950 dark:border-amber-900/60 dark:bg-slate-900/95 dark:text-amber-100 shadow-amber-500/10'
                : 'border-blue-200 bg-white/95 text-blue-950 dark:border-blue-900/60 dark:bg-slate-900/95 dark:text-blue-100 shadow-blue-500/10'
            }`}
          >
            <div className="shrink-0 pt-0.5">
              {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
              {t.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
              {t.type === 'info' && <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0">
              {t.title && (
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.title}
                </h4>
              )}
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                {t.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
