'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import {
  Heart,
  Star,
  CheckCircle,
  Clock,
  Eye,
  MessageCircle,
  Camera,
  Sparkles
} from 'lucide-react';

export default function ParentDashboardPage() {
  const { user } = useAuth();

  return (
    <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md shadow-pink-500/20">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  Bảng Tin Bán Trú Học Đường Dành Cho Phụ Huynh
                </h1>
                <p className="text-xs text-slate-500">
                  Xem đối chứng ảnh khay cơm thực tế ↔ ảnh chuẩn định lượng thời gian thực và đánh giá sao
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <button className="inline-flex items-center space-x-1.5 rounded-xl bg-pink-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-pink-500 transition">
              <Star className="h-4 w-4" />
              <span>Chấm điểm bữa trưa hôm nay</span>
            </button>
          </div>
        </div>

        {/* Real-time Status Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Lớp học con em</span>
            <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">Lớp 3A2</div>
            <span className="text-[11px] text-slate-400">GVCN: Cô Nguyễn Thu Hà</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Tiến độ phục vụ</span>
            <div className="mt-2 text-xl font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle className="h-5 w-5" />
              <span>Đã hoàn tất bữa trưa</span>
            </div>
            <span className="text-[11px] text-slate-400">Ăn xong lúc 11:45</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Ảnh thực tế đối chiếu</span>
            <div className="mt-2 text-2xl font-extrabold text-blue-600">3 / 3 ảnh</div>
            <span className="text-[11px] text-slate-400">Đầy đủ Watermark & đóng dấu giờ</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Đánh giá trung bình</span>
            <div className="mt-2 text-2xl font-extrabold text-amber-500 flex items-center gap-1">
              <span>4.9</span>
              <span className="text-sm font-normal text-slate-400">/ 5.0 ⭐</span>
            </div>
            <span className="text-[11px] text-slate-400">Từ 28 phụ huynh cùng lớp</span>
          </div>
        </div>

        {/* Feature 05 Notice */}
        <div className="mt-8 rounded-2xl border border-pink-200 bg-pink-50/50 p-6 dark:border-pink-900/40 dark:bg-pink-950/20">
          <div className="flex items-start space-x-3">
            <Eye className="h-6 w-6 text-pink-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-pink-950 dark:text-pink-200">
                Quy trình Nghiệp vụ FEAT-05: Bảng Tin Thời Gian Thực & Phụ Huynh Đánh Giá
              </h3>
              <p className="mt-1 text-xs text-pink-900/80 dark:text-pink-300">
                Sau 11:30, cổng dữ liệu tự động mở công khai ảnh Suất Tiêu Chuẩn của Bếp trường cạnh 3 ảnh khay cơm thực tế của lớp để phụ huynh giám sát trực tiếp từ điện thoại.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
