'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { MacroCard } from '@/components/MacroCard';
import { MealCard } from '@/components/MealCard';
import { AddMealModal } from '@/components/AddMealModal';
import { MealDetailModal } from '@/components/MealDetailModal';
import { EditMealModal } from '@/components/EditMealModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { DailySummary, Meal, MealRequest } from '@/types';
import { apiClient } from '@/lib/api';
import { Scale, Droplets, Utensils, Sparkles, Calendar, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRoleDashboardPath } from '@/lib/roleNavigation';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mealForDetail, setMealForDetail] = useState<Meal | null>(null);
  const [mealForEdit, setMealForEdit] = useState<Meal | null>(null);
  const [mealForDelete, setMealForDelete] = useState<Meal | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Role auto-redirect: if a role (e.g. Teacher, Admin, Supplier) lands on '/', route to their dedicated portal
  useEffect(() => {
    if (!authLoading && user) {
      const roleDashboard = getRoleDashboardPath(user.roles);
      if (roleDashboard !== '/') {
        router.replace(roleDashboard);
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  }, [selectedDate]);

  const fetchDailySummary = useCallback(async (date: string) => {
    try {
      setLoading(true);
      const data = await apiClient<DailySummary>(`/api/v1/meals/summary?date=${date}`);
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && selectedDate) {
      fetchDailySummary(selectedDate);
    } else {
      setLoading(false);
    }
  }, [user, selectedDate, fetchDailySummary]);

  const handleAddMeal = async (data: MealRequest | MealRequest[]) => {
    const items = Array.isArray(data) ? data : [data];
    if (items.length === 0) return;

    if (items.length === 1) {
      await apiClient('/api/v1/meals', {
        method: 'POST',
        body: JSON.stringify(items[0]),
      });
    } else {
      await apiClient('/api/v1/meals/batch', {
        method: 'POST',
        body: JSON.stringify(items),
      });
    }
    await fetchDailySummary(selectedDate);
  };

  const handleEditMeal = async (id: number, data: MealRequest) => {
    await apiClient(`/api/v1/meals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    await fetchDailySummary(selectedDate);
  };

  const handleDeleteMeal = async (id: number) => {
    await apiClient(`/api/v1/meals/${id}`, {
      method: 'DELETE',
    });
    await fetchDailySummary(selectedDate);
  };

  if (!mounted || authLoading) {
    return (
      <div suppressHydrationWarning className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const roleDashboard = getRoleDashboardPath(user?.roles);
  if (user && roleDashboard !== '/') {
    return (
      <div suppressHydrationWarning className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-slate-950 dark:to-slate-900">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Vibe Meal Tracking - Phù hợp khẩu vị & món ăn Việt</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
            Theo dõi bữa ăn & khẩu phần{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              chuẩn định lượng
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
            Dễ dàng ghi nhận món canh, món kho, món xào, món rán, đồ tráng miệng, bún, miến, phở, cháo theo định lượng gram (g) và mililit (ml). Bảo mật tối đa với Spring Security OAuth2 & Token Rotation.
          </p>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/register"
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition"
            >
              Bắt đầu miễn phí
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              Đăng nhập
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const meals: Meal[] = summary?.meals || [];
  const countByType = summary?.countByType || {};
  const distinctCategoriesCount = Object.keys(countByType).length;

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950">
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top greeting & Date filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Xin chào, {user.fullName}! 👋
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kiểm soát khẩu phần các món ăn hôm nay của bạn.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 outline-none dark:text-slate-200"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Thêm món</span>
            </button>
          </div>
        </div>

        {/* Nutrition / Quantity Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MacroCard
            label="Món đặc / khô"
            value={summary?.totalGrams || 0}
            unit="g"
            target={800}
            color="blue"
            icon={<Scale className="h-5 w-5" />}
          />
          <MacroCard
            label="Món canh / nước"
            value={summary?.totalMilliliters || 0}
            unit="ml"
            target={1200}
            color="teal"
            icon={<Droplets className="h-5 w-5" />}
          />
          <MacroCard
            label="Tổng số món"
            value={summary?.mealCount || 0}
            unit="món"
            color="amber"
            icon={<Utensils className="h-5 w-5" />}
          />
          <MacroCard
            label="Đa dạng nhóm món"
            value={distinctCategoriesCount}
            unit="nhóm"
            target={5}
            color="rose"
            icon={<Sparkles className="h-5 w-5" />}
          />
        </div>

        {/* Category distribution pills if meals exist */}
        {Object.keys(countByType).length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 mr-1">
              Phân bổ món:
            </span>
            {Object.entries(countByType).map(([category, count]) => (
              <span
                key={category}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <span>{category}</span>
                <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                  {String(count)}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Meals Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Danh sách món ăn trong ngày ({meals.length})
            </h2>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
              <span>Đặc: <strong className="text-blue-600">{summary?.totalGrams || 0} g</strong></span>
              <span>Canh/Nước: <strong className="text-teal-600">{summary?.totalMilliliters || 0} ml</strong></span>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 flex justify-center py-12">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            </div>
          ) : meals.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                <PlusCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-white">
                Chưa có món ăn nào được ghi nhận cho ngày này
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Bắt đầu thêm món canh, kho, xào, rán, tráng miệng, bún, miến, phở, cháo bạn đã dùng.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition"
              >
                + Ghi nhận món ăn ngay
              </button>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onViewDetail={(m) => setMealForDetail(m)}
                  onEdit={(m) => setMealForEdit(m)}
                  onDelete={(m) => setMealForDelete(m)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      <AddMealModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMeal}
      />

      {/* Detail Modal */}
      <MealDetailModal
        isOpen={!!mealForDetail}
        meal={mealForDetail}
        onClose={() => setMealForDetail(null)}
        onEdit={(m) => setMealForEdit(m)}
        onDelete={(m) => setMealForDelete(m)}
      />

      {/* Edit Modal */}
      <EditMealModal
        isOpen={!!mealForEdit}
        meal={mealForEdit}
        onClose={() => setMealForEdit(null)}
        onSubmit={handleEditMeal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!mealForDelete}
        meal={mealForDelete}
        onClose={() => setMealForDelete(null)}
        onConfirm={handleDeleteMeal}
      />
    </div>
  );
}
