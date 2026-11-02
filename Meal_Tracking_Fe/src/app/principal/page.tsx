'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import {
  GraduationCap,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Users,
  FileSpreadsheet,
  ShieldCheck
} from 'lucide-react';

export default function PrincipalDashboardPage() {
  const { user } = useAuth();

  return (
    <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  Cổng Điều Hành Bán Trú - Ban Giám Hiệu & Hiệu Trưởng
                </h1>
                <p className="text-xs text-slate-500">
                  Báo cáo tổng hợp chất lượng, định lượng, chỉ số an toàn nhiệt độ và mức độ hài lòng phụ huynh toàn trường
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <button className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Xuất Báo Cáo Tuân Thủ (Excel/PDF)</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Tổng học sinh bán trú</span>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              1,280 <span className="text-sm font-normal text-slate-500">học sinh</span>
            </div>
            <span className="text-[11px] text-slate-400">32 / 32 lớp học</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Tuân thủ lưu mẫu 24h</span>
            <div className="mt-2 text-2xl font-extrabold text-emerald-600">100%</div>
            <span className="text-[11px] text-slate-400">Niêm phong đủ tem và ký nhận y tế</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Cảnh báo nhiệt độ cổng</span>
            <div className="mt-2 text-2xl font-extrabold text-emerald-600">0 sự cố</div>
            <span className="text-[11px] text-slate-400">Nhiệt độ trung bình 67.2°C</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Chỉ số hài lòng phụ huynh</span>
            <div className="mt-2 text-2xl font-extrabold text-amber-500 flex items-center gap-1">
              <span>98.6%</span>
              <span className="text-sm font-normal text-slate-400">tích cực</span>
            </div>
            <span className="text-[11px] text-slate-400">Đánh giá trung bình 4.85 / 5 sao</span>
          </div>
        </div>

        {/* School Overview */}
        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/40 dark:bg-blue-950/20">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="h-6 w-6 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-blue-950 dark:text-blue-200">
                Vai trò Ban Giám Hiệu Trong Hệ Thống Giám Sát MealTrace
              </h3>
              <p className="mt-1 text-xs text-blue-900/80 dark:text-blue-300">
                Hiệu trưởng nắm quyền kiểm soát toàn diện luồng dữ liệu 6 trạng thái từ bếp đến lớp học, nhận báo cáo sai lệch định lượng g/ml và cảnh báo bù thiếu kịp thời.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
