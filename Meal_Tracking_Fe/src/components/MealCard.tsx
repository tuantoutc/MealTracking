'use client';

import React from 'react';
import { Meal, DishType, DISH_TYPES } from '@/types';
import { Clock, Trash2, Scale, Droplet, Edit2, Eye } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
  onViewDetail: (meal: Meal) => void;
  onEdit: (meal: Meal) => void;
  onDelete: (meal: Meal) => void;
}

const dishTypeStyles: Record<DishType, { bg: string; text: string; border: string }> = {
  COM: { bg: 'bg-amber-50 dark:bg-amber-950/50', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  CANH: { bg: 'bg-emerald-50 dark:bg-emerald-950/50', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  KHO: { bg: 'bg-orange-50 dark:bg-orange-950/50', text: 'text-orange-800 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  XAO: { bg: 'bg-yellow-50 dark:bg-yellow-950/50', text: 'text-yellow-800 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800' },
  RAN: { bg: 'bg-red-50 dark:bg-red-950/50', text: 'text-red-800 dark:text-red-300', border: 'border-red-200 dark:border-red-800' },
  TRANG_MIENG: { bg: 'bg-pink-50 dark:bg-pink-950/50', text: 'text-pink-800 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
  BUN: { bg: 'bg-teal-50 dark:bg-teal-950/50', text: 'text-teal-800 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
  MIEN: { bg: 'bg-cyan-50 dark:bg-cyan-950/50', text: 'text-cyan-800 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
  PHO: { bg: 'bg-blue-50 dark:bg-blue-950/50', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  CHAO: { bg: 'bg-indigo-50 dark:bg-indigo-950/50', text: 'text-indigo-800 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  KHAC: { bg: 'bg-purple-50 dark:bg-purple-950/50', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
};

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const matchedType = DISH_TYPES.find((d) => d.value === meal.dishType);
  const style = dishTypeStyles[meal.dishType] || dishTypeStyles.CANH;

  const timeFormatted = new Date(meal.mealTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isLiquid = meal.unit.toLowerCase() === 'ml';
  const isCustom = meal.dishType === 'KHAC' && meal.customDishType;
  const displayLabel = isCustom ? meal.customDishType : (matchedType?.label || meal.dishTypeDisplay || meal.dishType);
  const displayIcon = matchedType?.icon || (isCustom ? '✨' : '🍲');

  // Check 30 minutes edit window
  const createdTime = meal.createdAt ? new Date(meal.createdAt).getTime() : Date.now();
  const isEditable = (createdTime + 30 * 60 * 1000) > Date.now();

  return (
    <div
      onClick={() => onViewDetail(meal)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-400 hover:shadow-md cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600"
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
              <span>{displayIcon}</span>
              <span>{displayLabel}</span>
            </span>
            <span className="flex items-center text-xs text-slate-400">
              <Clock className="mr-1 h-3 w-3" />
              {timeFormatted}
            </span>
          </div>

          {/* Action buttons (stop propagation so clicking them does not trigger view detail) */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onViewDetail(meal)}
              className="rounded-lg p-1.5 text-slate-400 opacity-60 hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100 transition-all dark:hover:bg-slate-800"
              title="Xem chi tiết món"
            >
              <Eye className="h-4 w-4" />
            </button>

            {isEditable && (
              <button
                onClick={() => onEdit(meal)}
                className="rounded-lg p-1.5 text-slate-400 opacity-60 hover:bg-emerald-50 hover:text-emerald-600 group-hover:opacity-100 transition-all dark:hover:bg-emerald-950/40"
                title="Chỉnh sửa món (còn trong hạn 30 phút)"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => onDelete(meal)}
              className="rounded-lg p-1.5 text-slate-400 opacity-60 hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 transition-all dark:hover:bg-rose-950/40"
              title="Xóa món ăn"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
          {meal.title}
        </h3>

        {meal.notes && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
            {meal.notes}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <span>Định lượng:</span>
          {isEditable ? (
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" title="Có thể chỉnh sửa (trong 30 phút)" />
          ) : (
            <span className="inline-block h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" title="Đã qua 30 phút (khóa sửa)" />
          )}
        </div>
        <span className={`inline-flex items-center gap-1 font-bold text-sm px-2.5 py-1 rounded-lg ${
          isLiquid
            ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
        }`}>
          {isLiquid ? <Droplet className="h-3.5 w-3.5" /> : <Scale className="h-3.5 w-3.5" />}
          {meal.amount} {meal.unit}
        </span>
      </div>
    </div>
  );
};
