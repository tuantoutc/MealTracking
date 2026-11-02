'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import {
  Camera,
  CheckCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FolderArchive,
  Sparkles
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const { user } = useAuth();

  return (
    <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  Cổng Nghiệp Vụ Giáo Viên Chủ Nhiệm
                </h1>
                <p className="text-xs text-slate-500">
                  Tiếp nhận khay cơm tại phòng học, chụp ảnh Watermark 3 khay cơm ngẫu nhiên & xác nhận lưu mẫu 24h
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <button className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition">
              <Camera className="h-4 w-4" />
              <span>Chụp 3 Ảnh Khay Cơm (Tri-Photo)</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Khung giờ lớp nhận</span>
            <div className="mt-2 text-xl font-bold text-emerald-600">11:00 - 11:30</div>
            <span className="text-[11px] text-slate-400">Giờ ăn trưa của học sinh</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Chụp ảnh tuân thủ</span>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              Bắt buộc 3 ảnh
            </div>
            <span className="text-[11px] text-emerald-600">Watermark cứng: Giờ + Lớp + Hash</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Trạng thái lưu mẫu 24h</span>
            <div className="mt-2 text-xl font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle className="h-5 w-5" />
              <span>Đã niêm phong tủ lạnh</span>
            </div>
            <span className="text-[11px] text-slate-400">Nhiệt độ 2 - 8°C chuẩn BYT</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Sĩ số lớp ăn bán trú</span>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              36 / 36 <span className="text-sm font-normal text-slate-500">học sinh</span>
            </div>
            <span className="text-[11px] text-slate-400">Đã phát đủ 100% khay</span>
          </div>
        </div>

        {/* Feature 04 Guide */}
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-start space-x-3">
            <FolderArchive className="h-6 w-6 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
                Quy trình Nghiệp vụ FEAT-04: Tiếp Nhận Tại Lớp, Tri-Photo Rule & Lưu Mẫu 24H
              </h3>
              <p className="mt-1 text-xs text-emerald-900/80 dark:text-emerald-300">
                Giáo viên kích hoạt camera chụp trực tiếp 3 khay cơm ngẫu nhiên của 3 học sinh khác nhau. Hệ thống tự động đóng dấu Watermark chống gian lận và kiểm tra hash SHA-256 chống tải ảnh trùng lặp.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
