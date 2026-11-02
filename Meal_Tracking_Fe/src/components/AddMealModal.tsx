'use client';

import React, { useState } from 'react';
import { MealRequest, DishType, DISH_TYPES, DishTypeOption } from '@/types';
import {
  X,
  Sparkles,
  Scale,
  Droplet,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Check,
} from 'lucide-react';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (items: MealRequest[]) => Promise<void>;
}

interface DishDraft {
  id: string;
  title: string;
  dishType: DishType;
  customDishType?: string;
  amount: string;
  unit: string;
  notes: string;
  isCollapsed: boolean;
}

const PRESETS: Array<{ title: string; dishType: DishType; amount: number; unit: string }> = [
  { title: 'Cơm trắng', dishType: 'COM', amount: 150, unit: 'g' },
  { title: 'Thịt ba chỉ kho tàu', dishType: 'KHO', amount: 200, unit: 'g' },
  { title: 'Canh bí thịt bằm', dishType: 'CANH', amount: 350, unit: 'ml' },
  { title: 'Rau muống xào tỏi', dishType: 'XAO', amount: 150, unit: 'g' },
  { title: 'Nem rán / Chả giò', dishType: 'RAN', amount: 180, unit: 'g' },
  { title: 'Phở bò tái nạm', dishType: 'PHO', amount: 450, unit: 'ml' },
  { title: 'Bún bò Huế', dishType: 'BUN', amount: 450, unit: 'ml' },
  { title: 'Cháo sườn quẩy', dishType: 'CHAO', amount: 350, unit: 'ml' },
  { title: 'Chè khúc bạch', dishType: 'TRANG_MIENG', amount: 180, unit: 'g' },
];

const createEmptyDraft = (index: number): DishDraft => ({
  id: `draft-${Date.now()}-${index}`,
  title: '',
  dishType: index === 1 ? 'COM' : index === 2 ? 'CANH' : index === 3 ? 'KHO' : 'XAO',
  customDishType: '',
  amount: '150',
  unit: index === 2 ? 'ml' : 'g',
  notes: '',
  isCollapsed: false,
});

export const AddMealModal: React.FC<AddMealModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [items, setItems] = useState<DishDraft[]>([createEmptyDraft(1)]);
  const [customCategories, setCustomCategories] = useState<DishTypeOption[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const allCategories = [...DISH_TYPES, ...customCategories];

  const updateItem = (id: string, updates: Partial<DishDraft>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleSelectDishType = (itemId: string, type: DishType, customName?: string) => {
    const matched = allCategories.find(
      (c) => c.value === type && (!customName || (c as any).customName === customName)
    );
    updateItem(itemId, {
      dishType: type,
      customDishType: customName || '',
      unit: matched ? matched.defaultUnit : 'g',
    });
  };

  const handleAddCustomCategory = (targetItemId: string) => {
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
    handleSelectDishType(targetItemId, 'KHAC', trimmed);
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const handleApplyPreset = (p: typeof PRESETS[0], itemId: string) => {
    updateItem(itemId, {
      title: p.title,
      dishType: p.dishType,
      customDishType: '',
      amount: String(p.amount),
      unit: p.unit,
    });
  };

  const handleAddNewItem = () => {
    setItems((prev) => {
      // Collapse previous items
      const collapsed = prev.map((it) => ({ ...it, isCollapsed: true }));
      const newDraft = createEmptyDraft(prev.length + 1);
      return [...collapsed, newDraft];
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      if (prev.length <= 1) {
        return [createEmptyDraft(1)];
      }
      const filtered = prev.filter((it) => it.id !== id);
      // Make sure at least one item is expanded
      if (!filtered.some((it) => !it.isCollapsed)) {
        filtered[filtered.length - 1].isCollapsed = false;
      }
      return filtered;
    });
  };

  const handleAmountChange = (itemId: string, rawVal: string) => {
    if (rawVal === '') {
      updateItem(itemId, { amount: '' });
      return;
    }
    // Clean leading zeros if not followed by decimal
    let cleaned = rawVal;
    if (cleaned.length > 1 && cleaned.startsWith('0') && !cleaned.startsWith('0.')) {
      cleaned = cleaned.replace(/^0+/, '');
    }
    updateItem(itemId, { amount: cleaned });
  };

  const handleSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate all items
    const validRequests: MealRequest[] = [];
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.title.trim()) {
        setFormError(`Món #${i + 1} chưa có tên. Vui lòng nhập tên món ăn.`);
        updateItem(it.id, { isCollapsed: false });
        return;
      }
      const numAmount = Number(it.amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setFormError(`Định lượng của món "${it.title}" phải lớn hơn 0.`);
        updateItem(it.id, { isCollapsed: false });
        return;
      }

      validRequests.push({
        title: it.title.trim(),
        dishType: it.dishType,
        customDishType: it.customDishType?.trim() || undefined,
        amount: numAmount,
        unit: it.unit,
        mealTime: new Date().toISOString(),
        notes: it.notes.trim() || undefined,
      });
    }

    if (validRequests.length === 0) return;

    setSubmitting(true);
    try {
      await onSubmit(validRequests);
      setItems([createEmptyDraft(1)]);
      onClose();
    } catch (err) {
      setFormError((err as Error).message || 'Có lỗi xảy ra khi lưu món ăn');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[92vh] rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Ghi nhận bữa ăn
              </h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                {items.length} món
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm một hoặc nhiều món cùng lúc (Cơm, Canh, Món kho, Xào...) theo định lượng g và ml
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content body */}
        <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          {formError && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
              ⚠️ {formError}
            </div>
          )}

          {/* Quick Presets for current active/expanded item */}
          <div className="rounded-2xl bg-slate-50/80 p-3.5 border border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-2 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Gợi ý chọn nhanh món Việt:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p, idx) => {
                const activeItem = items.find((it) => !it.isCollapsed) || items[0];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p, activeItem.id)}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition shadow-sm"
                  >
                    {p.title} ({p.amount}{p.unit})
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of items */}
          <div className="space-y-3">
            {items.map((item, index) => {
              const matchedType = allCategories.find((c) =>
                item.customDishType
                  ? c.value === 'KHAC' && c.label === item.customDishType
                  : c.value === item.dishType
              );

              // Collapsed Item Row
              if (item.isCollapsed) {
                return (
                  <div
                    key={item.id}
                    onClick={() => updateItem(item.id, { isCollapsed: false })}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm hover:border-emerald-500 hover:bg-emerald-50/20 cursor-pointer transition dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        #{index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.title || 'Món ăn chưa đặt tên'}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {matchedType?.icon || '🍲'} {item.customDishType || matchedType?.label || item.dishType}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {item.amount || '0'} {item.unit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, { isCollapsed: false })}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                        title="Chỉnh sửa món này"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                          title="Xóa món này"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              }

              // Expanded Item Form
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border-2 border-emerald-500/30 bg-white p-4 shadow-sm space-y-4 dark:border-emerald-500/20 dark:bg-slate-900/90"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shadow-sm">
                        {index + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {item.title ? item.title : `Thông tin món #${index + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => updateItem(item.id, { isCollapsed: true })}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                          <span>Thu gọn</span>
                        </button>
                      )}
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                          title="Xóa món này"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tên món */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tên món ăn *
                    </label>
                    <input
                      type="text"
                      required
                      value={item.title}
                      onChange={(e) => updateItem(item.id, { title: e.target.value })}
                      placeholder="Ví dụ: Cơm trắng, Canh bí sườn, Thịt kho tàu, Bún chả..."
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                          onClick={() => setIsAddingCategory(true)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-500"
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
                                handleAddCustomCategory(item.id);
                              }
                            }}
                            placeholder="Tên loại món (vd: Món nướng)..."
                            className="rounded-lg border border-emerald-500 px-2 py-0.5 text-xs outline-none dark:bg-slate-800 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomCategory(item.id)}
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
                      {allCategories.map((type, typeIdx) => {
                        const isCustom = type.value === 'KHAC' && type.label !== 'Khác';
                        const isSelected = isCustom
                          ? item.dishType === 'KHAC' && item.customDishType === type.label
                          : item.dishType === type.value && !item.customDishType;

                        return (
                          <button
                            type="button"
                            key={typeIdx}
                            onClick={() => handleSelectDishType(item.id, type.value, isCustom ? type.label : undefined)}
                            className={`flex items-center justify-center gap-1.5 rounded-xl p-2 text-xs font-semibold transition border ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-200 shadow-sm'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            <span>{type.icon}</span>
                            <span className="truncate">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Định lượng & Đơn vị (Fixes input overlap & step 146/151 & 0 leading bugs) */}
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
                          value={item.amount}
                          onChange={(e) => handleAmountChange(item.id, e.target.value)}
                          placeholder="Ví dụ: 150"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 pr-16 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-extrabold text-slate-600 uppercase dark:bg-slate-700 dark:text-slate-200">
                            {item.unit}
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
                          onClick={() => updateItem(item.id, { unit: 'g' })}
                          className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition border ${
                            item.unit === 'g'
                              ? 'border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-200 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          <Scale className="h-3.5 w-3.5" />
                          <span>Gram (g)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateItem(item.id, { unit: 'ml' })}
                          className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition border ${
                            item.unit === 'ml'
                              ? 'border-teal-600 bg-teal-50 text-teal-800 dark:border-teal-500 dark:bg-teal-950/60 dark:text-teal-200 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
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
                      value={item.notes}
                      onChange={(e) => updateItem(item.id, { notes: e.target.value })}
                      placeholder="Gia vị, nguyên liệu, cảm nhận..."
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Button to add another dish to this meal */}
          <button
            type="button"
            onClick={handleAddNewItem}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-400/80 bg-emerald-50/50 py-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100/60 transition dark:border-emerald-600/50 dark:bg-emerald-950/30 dark:text-emerald-300"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Thêm món khác vào bữa ăn này (Cơm, Canh, Món mặn...)</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 rounded-b-3xl shrink-0">
          <div className="text-xs text-slate-500">
            Tổng cộng: <strong className="text-slate-900 dark:text-white">{items.length} món ăn</strong>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmitAll}
              disabled={submitting}
              className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-50 transition"
            >
              {submitting ? 'Đang lưu...' : `Lưu tất cả (${items.length} món)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
