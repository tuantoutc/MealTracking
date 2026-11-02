'use client';

import React, { useState, useEffect } from 'react';
import { Meal, MealRequest, DishType, DISH_TYPES, DishTypeOption } from '@/types';
import {
  X,
  Scale,
  Droplet,
  Plus,
  Timer,
  AlertCircle,
  Save,
} from 'lucide-react';

interface EditMealModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, request: MealRequest) => Promise<void>;
}

export const EditMealModal: React.FC<EditMealModalProps> = ({
  meal,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [dishType, setDishType] = useState<DishType>('COM');
  const [customDishType, setCustomDishType] = useState('');
  const [amount, setAmount] = useState('150');
  const [unit, setUnit] = useState('g');
  const [notes, setNotes] = useState('');

  const [customCategories, setCustomCategories] = useState<DishTypeOption[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [timeRemaining, setTimeRemaining] = useState<{
    isEditable: boolean;
    minutes: number;
    seconds: number;
  }>({ isEditable: true, minutes: 30, seconds: 0 });

  useEffect(() => {
    if (!isOpen || !meal) return;

    setTitle(meal.title || '');
    setDishType(meal.dishType || 'COM');
    setCustomDishType(meal.customDishType || '');
    setAmount(meal.amount ? String(meal.amount) : '150');
    setUnit(meal.unit || 'g');
    setNotes(meal.notes || '');
    setFormError(null);

    const calculateRemaining = () => {
      const createdTime = meal.createdAt ? new Date(meal.createdAt).getTime() : Date.now();
      const expiresAt = createdTime + 30 * 60 * 1000;
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

  const allCategories = [...DISH_TYPES, ...customCategories];

  const handleSelectDishType = (type: DishType, customName?: string) => {
    const matched = allCategories.find(
      (c) => c.value === type && (!customName || (c as any).customName === customName)
    );
    setDishType(type);
    setCustomDishType(customName || '');
    if (matched) {
      setUnit(matched.defaultUnit);
    }
  };

  const handleAddCustomCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setIsAddingCategory(false);
      return;
    }

    const newOption: DishTypeOption = {
      value: 'KHAC',
      label: trimmed,
      defaultUnit: 'g',
      icon: '✨',
    };

    setCustomCategories((prev) => [...prev, newOption]);
    handleSelectDishType('KHAC', trimmed);
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const handleAmountChange = (rawVal: string) => {
    if (rawVal === '') {
      setAmount('');
      return;
    }
    let cleaned = rawVal;
    if (cleaned.length > 1 && cleaned.startsWith('0') && !cleaned.startsWith('0.')) {
      cleaned = cleaned.replace(/^0+/, '');
    }
    setAmount(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!timeRemaining.isEditable) {
      setFormError('Đã quá 30 phút kể từ lúc tạo món ăn. Không thể chỉnh sửa!');
      return;
    }

    if (!title.trim()) {
      setFormError('Vui lòng nhập tên món ăn.');
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError('Định lượng phải là số lớn hơn 0.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(meal.id, {
        title: title.trim(),
        dishType,
        customDishType: customDishType?.trim() || undefined,
        amount: numAmount,
        unit,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setFormError((err as Error).message || 'Có lỗi xảy ra khi cập nhật món ăn');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-lg max-h-[92vh] rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Chỉnh sửa món ăn
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cập nhật tên món, loại món hoặc định lượng
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {formError && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
              ⚠️ {formError}
            </div>
          )}

          {/* Time Remaining Notice */}
          <div className={`rounded-2xl p-3 border flex items-center justify-between ${
            timeRemaining.isEditable
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50/80 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300'
          }`}>
            <div className="flex items-center gap-2 text-xs font-semibold">
              {timeRemaining.isEditable ? (
                <Timer className="h-4 w-4 text-emerald-600 animate-pulse" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600" />
              )}
              <span>
                {timeRemaining.isEditable
                  ? `Thời hạn chỉnh sửa: Còn ${timeRemaining.minutes}p ${timeRemaining.seconds}s`
                  : 'Đã hết hạn chỉnh sửa (> 30 phút)'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-500">Quy tắc 30 phút</span>
          </div>

          {/* Tên món */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tên món ăn *
            </label>
            <input
              type="text"
              required
              disabled={!timeRemaining.isEditable}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Cơm trắng, Canh bí sườn..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Phân loại món */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Loại món ăn *
              </label>
              {!isAddingCategory ? (
                <button
                  type="button"
                  disabled={!timeRemaining.isEditable}
                  onClick={() => setIsAddingCategory(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-500 disabled:opacity-40"
                >
                  <Plus className="h-3 w-3" />
                  <span>Thêm loại món mới</span>
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomCategory();
                      }
                    }}
                    placeholder="Tên loại món..."
                    className="rounded-lg border border-emerald-500 px-2 py-0.5 text-xs outline-none dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="rounded-lg bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName('');
                    }}
                    className="rounded-lg p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {allCategories.map((type, idx) => {
                const isCustom = type.value === 'KHAC' && type.label !== 'Khác';
                const isSelected = isCustom
                  ? dishType === 'KHAC' && customDishType === type.label
                  : dishType === type.value && !customDishType;

                return (
                  <button
                    type="button"
                    key={idx}
                    disabled={!timeRemaining.isEditable}
                    onClick={() => handleSelectDishType(type.value, isCustom ? type.label : undefined)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl p-2 text-xs font-semibold transition border ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-200 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    } disabled:opacity-40`}
                  >
                    <span>{type.icon}</span>
                    <span className="truncate">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Định lượng & Đơn vị */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Định lượng khẩu phần *
              </label>
              <div className="relative mt-1">
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  disabled={!timeRemaining.isEditable}
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="150"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 pr-16 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-extrabold text-slate-600 uppercase dark:bg-slate-700 dark:text-slate-200">
                    {unit}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Đơn vị tính *
              </label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={!timeRemaining.isEditable}
                  onClick={() => setUnit('g')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition border ${
                    unit === 'g'
                      ? 'border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-200 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  } disabled:opacity-40`}
                >
                  <Scale className="h-3.5 w-3.5" />
                  <span>Gram (g)</span>
                </button>
                <button
                  type="button"
                  disabled={!timeRemaining.isEditable}
                  onClick={() => setUnit('ml')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition border ${
                    unit === 'ml'
                      ? 'border-teal-600 bg-teal-50 text-teal-800 dark:border-teal-500 dark:bg-teal-950/60 dark:text-teal-200 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  } disabled:opacity-40`}
                >
                  <Droplet className="h-3.5 w-3.5" />
                  <span>Mililit (ml)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ghi chú thêm
            </label>
            <input
              type="text"
              disabled={!timeRemaining.isEditable}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gia vị, nguyên liệu, cảm nhận..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white disabled:bg-slate-100"
            />
          </div>

          {/* Form Actions inside Footer */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitting || !timeRemaining.isEditable}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{submitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
