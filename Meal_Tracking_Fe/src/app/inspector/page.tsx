'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import {
  Thermometer,
  ShieldCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  QrCode,
  FileCheck
} from 'lucide-react';

export default function GateInspectorDashboardPage() {
  const { user } = useAuth();

  return (
    <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  Cổng Tiếp Nhận & Kiểm Duyệt Cổng Trường (Gate Handover)
                </h1>
                <p className="text-xs text-slate-500">
                  Đối chiếu xe giao, đo kiểm nhiệt độ ≥ 60°C, đếm suất thực tế & xác nhận bù thiếu
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <button className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition">
              <QrCode className="h-4 w-4" />
              <span>Quét mã xe & Tiếp nhận lô (09:45 - 10:30)</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Khung giờ bàn giao chuẩn</span>
            <div className="mt-2 text-xl font-bold text-indigo-600">09:45 - 10:30</div>
            <span className="text-[11px] text-slate-400">Nghiêm cấm nhận trễ quá 10:30</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Chuẩn nhiệt độ an toàn</span>
            <div className="mt-2 text-2xl font-extrabold text-emerald-600">≥ 60.0°C</div>
            <span className="text-[11px] text-slate-400">Đo bằng nhiệt kế kim chuẩn kiểm định</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Số xe đã tiếp nhận</span>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              1 / 2 <span className="text-sm font-normal text-slate-500">xe</span>
            </div>
            <span className="text-[11px] text-emerald-600">Xe 1 đạt chuẩn 68.5°C</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Hao hụt / Bù thiếu</span>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              0 <span className="text-sm font-normal text-slate-500">suất</span>
            </div>
            <span className="text-[11px] text-slate-400">Đủ 100% định mức cam kết</span>
          </div>
        </div>

        {/* Feature 02 Guide */}
        <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <div className="flex items-start space-x-3">
            <Thermometer className="h-6 w-6 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-200">
                Quy trình Nghiệp vụ FEAT-02: Bàn Giao Cổng Trường & Cảnh Báo Nhiệt Độ
              </h3>
              <p className="mt-1 text-xs text-indigo-900/80 dark:text-indigo-300">
                Cán bộ cổng trường thực hiện kiểm tra cảm quan mùi vị, so sánh biển số xe với hồ sơ đăng ký, đo trực tiếp nhiệt độ trung tâm món ăn nóng (≥ 60°C) và nhập mã PIN xác nhận bàn giao điện tử.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
