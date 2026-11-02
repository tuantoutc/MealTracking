'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import {
  Landmark,
  ShieldCheck,
  Search,
  FileText,
  AlertTriangle,
  Building,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function WardDashboardPage() {
  const { user } = useAuth();

  return (
    <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/20">
                <Landmark className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  Cổng Giám Sát Y Tế & An Toàn Thực Phẩm Tuyến Phường
                </h1>
                <p className="text-xs text-slate-500">
                  Tra cứu nguồn gốc nguyên liệu thực phẩm, nhật ký bàn giao cổng và giám sát quy trình lưu mẫu 24h
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <button className="inline-flex items-center space-x-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-500 transition">
              <Search className="h-4 w-4" />
              <span>Tra Cứu Lô Thực Phẩm & Mẫu Lưu</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Trường học trên địa bàn</span>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              6 <span className="text-sm font-normal text-slate-500">trường</span>
            </div>
            <span className="text-[11px] text-slate-400">Tiểu học & THCS bán trú</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Bếp trung tâm cung ứng</span>
            <div className="mt-2 text-2xl font-extrabold text-purple-600">
              3 <span className="text-sm font-normal text-slate-500">đơn vị</span>
            </div>
            <span className="text-[11px] text-emerald-600">100% có chứng nhận ATTP</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Kiểm tra đột xuất tháng này</span>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              8 <span className="text-sm font-normal text-slate-500">lượt</span>
            </div>
            <span className="text-[11px] text-slate-400">Đạt chuẩn 8/8 lượt kiểm tra</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Sự cố ngộ độc / Cảnh báo</span>
            <div className="mt-2 text-2xl font-extrabold text-emerald-600">0 vụ</div>
            <span className="text-[11px] text-emerald-600">An toàn tuyệt đối 100%</span>
          </div>
        </div>

        {/* Ward Overview */}
        <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50/50 p-6 dark:border-purple-900/40 dark:bg-purple-950/20">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="h-6 w-6 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-purple-950 dark:text-purple-200">
                Thẩm Quyền Giám Sát Của Cán Bộ Phường / Y Tế Cơ Sở
              </h3>
              <p className="mt-1 text-xs text-purple-900/80 dark:text-purple-300">
                Cán bộ phường có thẩm quyền xem xét chứng từ nguồn gốc thực phẩm, kết quả đo nhiệt độ bàn giao tại cổng và tình trạng niêm phong mẫu lưu 24h của các cơ sở giáo dục trên địa bàn phụ trách.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
