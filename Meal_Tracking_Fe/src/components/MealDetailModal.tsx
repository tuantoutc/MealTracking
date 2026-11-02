'use client';

import React, { useEffect, useState } from 'react';
import { Meal, DISH_TYPES } from '@/types';
import {
  X,
  Clock,
  Scale,
  Droplet,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  Timer,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface MealDetailModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (meal: Meal) => void;
  onDelete: (meal: Meal) => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  meal,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<{
    isEditable: boolean;
    minutes: number;
    seconds: number;
  }>({ isEditable: false, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isOpen || !meal) return;

    const calculateRemaining = () => {
      const createdTime = meal.createdAt ? new Date(meal.createdAt).getTime() : Date.now();
      const expiresAt = createdTime + 30 * 60 * 1000; // 30 phút
      const diff = expiresAt - Date.now();

      if (diff > 0) {
        setTimeRemaining({
          isEditable: true,
          minutes: Math.floor(diff / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      } else {
        setTimeRemaining({
          isEditable: false,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [isOpen, meal]);

  if (!isOpen || !meal) return null;

  const matchedType = DISH_TYPES.find((d) => d.value === meal.dishType);
  const isCustom = meal.dishType === 'KHAC' && meal.customDishType;
  const displayLabel = isCustom ? meal.customDishType : (matchedType?.label || meal.dishTypeDisplay || meal.dishType);
  const displayIcon = matchedType?.icon || (isCustom ? '✨' : '🍲');
  const isLiquid = meal.unit.toLowerCase() === 'ml';

  const mealDate = new Date(meal.mealTime).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mealHour = new Date(meal.mealTime).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const createdFormatted = meal.createdAt
    ? new Date(meal.createdAt).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-lg rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="text-xl">{displayIcon}</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Chi tiết món ăn
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title & Badge */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300">
                <span>{displayIcon}</span>
                <span>{displayLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {mealHour}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {meal.title}
            </h2>
          </div>

          {/* Amount Card */}
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 p-4 border border-slate-200/80 dark:from-slate-800/50 dark:to-slate-800/20 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                isLiquid ? 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              }`}>
                {isLiquid ? <Droplet className="h-6 w-6" /> : <Scale className="h-6 w-6" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Định lượng khẩu phần</div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {meal.amount} <span className="text-sm font-bold text-slate-500">{meal.unit}</span>
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {isLiquid ? 'Chất lỏng / Canh' : 'Thức ăn đặc / Khô'}
            </span>
          </div>

          {/* Meta Info */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Calendar className="h-3.5 w-3.5 text-slate-400" /> Ngày dùng bữa:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {mealDate}
              </span>
            </div>

            {createdFormatted && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> Thời gian khởi tạo:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {createdFormatted}
                </span>
              </div>
            )}

            {meal.notes && (
              <div className="pt-2">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium mb-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-400" /> Ghi chú:
                </span>
                <div className="rounded-xl bg-slate-50 p-3 text-slate-700 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700/60 dark:text-slate-300">
                  {meal.notes}
                </div>
              </div>
            )}
          </div>

          {/* 30-Minute Edit Window Status Alert */}
          <div className={`rounded-2xl p-3.5 border flex items-start gap-3 ${
            timeRemaining.isEditable
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
              : 'bg-amber-50/70 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200'
          }`}>
            {timeRemaining.isEditable ? (
              <Timer className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              {timeRemaining.isEditable ? (
                <>
                  <div className="font-bold">
                    Đang trong thời gian cho phép chỉnh sửa
                  </div>
                  <div className="mt-0.5 text-emerald-700 dark:text-emerald-300">
                    Bạn còn{' '}
                    <strong className="font-extrabold text-emerald-800 dark:text-emerald-200">
                      {timeRemaining.minutes} phút {timeRemaining.seconds} giây
                    </strong>{' '}
                    để cập nhật lại tên, định lượng hoặc loại món.
                  </div>
                </>
              ) : (
                <>
                  <div className="font-bold">Đã hết hạn chỉnh sửa (&gt; 30 phút)</div>
                  <div className="mt-0.5 text-amber-700 dark:text-amber-300">
                    Theo quy tắc nghiệp vụ, món ăn chỉ được phép sửa đổi trong vòng 30 phút kể từ lúc tạo để bảo toàn tính toàn vẹn dữ liệu.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(meal);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <Trash2 className="h-4 w-4" />
            <span>Xóa món</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 transition"
            >
              Đóng
            </button>

            <button
              type="button"
              disabled={!timeRemaining.isEditable}
              onClick={() => {
                onClose();
                onEdit(meal);
              }}
              title={
                timeRemaining.isEditable
                  ? 'Chỉnh sửa thông tin món ăn'
                  : 'Đã quá 30 phút kể từ lúc tạo, không thể sửa'
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Chỉnh sửa món</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
