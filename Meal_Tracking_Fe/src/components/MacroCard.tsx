'use client';

import React from 'react';

interface MacroCardProps {
  label: string;
  value: number;
  unit: string;
  target?: number;
  color: 'emerald' | 'blue' | 'amber' | 'rose' | 'teal';
  icon: React.ReactNode;
}

const colorMap = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    bar: 'bg-emerald-500',
    iconBg: 'bg-emerald-500 text-white',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800/60',
    text: 'text-blue-700 dark:text-blue-300',
    bar: 'bg-blue-500',
    iconBg: 'bg-blue-500 text-white',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800/60',
    text: 'text-amber-700 dark:text-amber-300',
    bar: 'bg-amber-500',
    iconBg: 'bg-amber-500 text-white',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800/60',
    text: 'text-rose-700 dark:text-rose-300',
    bar: 'bg-rose-500',
    iconBg: 'bg-rose-500 text-white',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    border: 'border-teal-200 dark:border-teal-800/60',
    text: 'text-teal-700 dark:text-teal-300',
    bar: 'bg-teal-500',
    iconBg: 'bg-teal-500 text-white',
  },
};

export const MacroCard: React.FC<MacroCardProps> = ({
  label,
  value,
  unit,
  target,
  color,
  icon,
}) => {
  const styles = colorMap[color] || colorMap.emerald;
  const percent = target ? Math.min(Math.round((value / target) * 100), 100) : null;

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md ${styles.bg} ${styles.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${styles.iconBg}`}>
            {icon}
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {label}
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {Math.round(value * 10) / 10}
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {unit}
              </span>
              {target && (
                <span className="text-xs text-slate-400">
                  / {target}{unit}
                </span>
              )}
            </div>
          </div>
        </div>
        {percent !== null && (
          <span className={`text-xs font-bold ${styles.text}`}>
            {percent}%
          </span>
        )}
      </div>

      {percent !== null && (
        <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-700/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
};
