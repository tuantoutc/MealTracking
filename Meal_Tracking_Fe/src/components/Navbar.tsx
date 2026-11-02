'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Utensils, LogOut, User as UserIcon, Plus, Shield, Award, AlertTriangle, X, Send } from 'lucide-react';
import Link from 'next/link';
import { ROLE_LABELS } from '@/types';
import { apiClient } from '@/lib/api';
import { getRoleDashboardPath } from '@/lib/roleNavigation';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { useToast } from '@/context/ToastContext';

interface NavbarProps {
  onOpenAddModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const { user, logout, updateCurrentUser, refreshUser } = useAuth();
  const { toast } = useToast();
  const [requestingBadge, setRequestingBadge] = useState(false);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [badgeReason, setBadgeReason] = useState('Đơn vị cung cấp suất ăn / Nhân viên bán trú');

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const roleDashboardPath = getRoleDashboardPath(user?.roles);
  const primaryRole = user?.roles?.[0] || user?.requestedRole || 'ROLE_USER';
  const roleMeta = ROLE_LABELS[primaryRole] || ROLE_LABELS['ROLE_USER'];

  const handleSubmitBadgeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeReason.trim()) {
      toast.warning('Vui lòng nhập lý do hoặc thông tin xác minh');
      return;
    }

    try {
      setRequestingBadge(true);
      await apiClient('/api/v1/auth/request-badge', {
        method: 'POST',
        body: JSON.stringify({ reason: badgeReason.trim() }),
      });
      setBadgeModalOpen(false);
      updateCurrentUser({ badgeRequested: true, badgeRequestReason: badgeReason.trim() });
      await refreshUser();
      toast.success('Đã gửi yêu cầu cấp tích xanh đến Quản trị viên! Vui lòng chờ xét duyệt.');
    } catch (err) {
      toast.error((err as Error).message || 'Không thể gửi yêu cầu cấp tích xanh');
    } finally {
      setRequestingBadge(false);
    }
  };

  return (
    <>
      {/* Warning Alert Banner for current user if they have warnings */}
      {user?.warningMessage && (
        <div className="bg-amber-500 text-white px-4 py-2 text-xs font-medium flex items-center justify-between">
          <div className="mx-auto max-w-7xl flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              <strong>Thông báo từ Quản Trị Viên:</strong> {user.warningMessage} (Tài khoản đã nhận {user.warningCount || 1} cảnh báo)
            </span>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Meal<span className="text-emerald-500">Trace</span>
              </span>
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                School Meal Verification
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Admin Dashboard shortcut button */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center space-x-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300 transition"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                {/* Role Workspace Portal link for other roles */}
                {!isAdmin && roleDashboardPath !== '/' && (
                  <Link
                    href={roleDashboardPath}
                    className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
                  >
                    <span>{roleMeta.icon}</span>
                    <span className="hidden md:inline">Cổng {roleMeta.label}</span>
                  </Link>
                )}

                {/* Request Badge button: ONLY shown if not verified yet, not admin, and not already requested */}
                {!isAdmin && !user.verifiedBadge && !user.badgeRequested && (
                  <button
                    onClick={() => setBadgeModalOpen(true)}
                    disabled={requestingBadge}
                    title="Yêu cầu cấp tích xanh xác thực danh tính"
                    className="hidden sm:inline-flex items-center space-x-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 transition"
                  >
                    <Award className="h-3.5 w-3.5 text-blue-600" />
                    <span>Xin tích xanh</span>
                  </button>
                )}

                {/* Badge requested pending indicator */}
                {!isAdmin && !user.verifiedBadge && user.badgeRequested && (
                  <span
                    title="Yêu cầu tích xanh đang chờ Admin xét duyệt"
                    className="hidden sm:inline-flex items-center space-x-1 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                  >
                    <span>⏳ Chờ duyệt tích xanh</span>
                  </span>
                )}

                {/* Add Meal shortcut (if provided) */}
                {onOpenAddModal && (
                  <button
                    onClick={onOpenAddModal}
                    className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 active:scale-95 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Thêm bữa ăn</span>
                  </button>
                )}

                {/* User Pill */}
                <div className="flex items-center space-x-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-2 pr-3 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <UserIcon className="h-4 w-4" />
                  </div>

                  <div className="flex items-center space-x-1 max-w-[150px]">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {user.fullName}
                    </span>
                    {user.verifiedBadge && (
                      <VerifiedBadge className="h-4 w-4 ml-0.5" />
                    )}
                  </div>

                  {/* Role badge */}
                  <span className={`hidden md:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleMeta.color}`}>
                    {roleMeta.label}
                  </span>

                  <button
                    onClick={() => logout()}
                    title="Đăng xuất"
                    className="text-slate-400 hover:text-rose-500 transition-colors ml-1"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MODAL: Xin cấp tích xanh */}
      {badgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <VerifiedBadge className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Đề Xuất Cấp Tích Xanh
                  </h3>
                  <p className="text-xs text-slate-500">Xác thực uy tín danh tính & cơ sở bán trú</p>
                </div>
              </div>
              <button
                onClick={() => setBadgeModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBadgeRequest} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lý do / Hồ sơ xác thực:
                </label>
                <textarea
                  rows={4}
                  required
                  value={badgeReason}
                  onChange={(e) => setBadgeReason(e.target.value)}
                  placeholder="Ví dụ: Giấy phép VSATTP số ..., Đại diện bếp trường Tiểu học ..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Thông tin này sẽ được gửi trực tiếp đến Quản trị viên hệ thống để kiểm duyệt.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBadgeModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={requestingBadge}
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{requestingBadge ? 'Đang gửi...' : 'Gửi yêu cầu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
