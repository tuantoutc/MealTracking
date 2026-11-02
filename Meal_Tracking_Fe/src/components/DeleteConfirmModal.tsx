'use client';

import React, { useState } from 'react';
import { Meal } from '@/types';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface DeleteConfirmModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  meal,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen || !meal) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(meal.id);
      toast.success('Đã xóa món ăn thành công');
      onClose();
    } catch (err) {
      toast.error((err as Error).message || 'Có lỗi xảy ra khi xóa món');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 text-center space-y-4">
          {/* Warning Icon with double glow */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-400">
            <Trash2 className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Xác nhận xóa món ăn?
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed dark:text-slate-400">
              Bạn có chắc chắn muốn xóa món{' '}
              <strong className="text-slate-900 dark:text-white font-extrabold">
                &ldquo;{meal.title}&rdquo;
              </strong>{' '}
              ({meal.amount} {meal.unit}) khỏi danh sách thực đơn hôm nay không?
            </p>
            <p className="mt-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              ⚠️ Hành động này sẽ trừ định lượng tương ứng và không thể hoàn tác.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="w-1/2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleConfirm}
              className="w-1/2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-500 disabled:opacity-50 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{loading ? 'Đang xóa...' : 'Xác nhận xóa'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
