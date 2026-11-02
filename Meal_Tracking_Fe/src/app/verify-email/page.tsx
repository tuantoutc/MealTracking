'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { User } from '@/types';
import { CheckCircle2, XCircle, Mail, ArrowRight, RefreshCw, Utensils } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Resend form state
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('Mã token kích hoạt không tồn tại hoặc đường link không đầy đủ.');
      return;
    }

    const doVerify = async () => {
      try {
        const data = await apiClient<User>(`/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`);
        setSuccess(true);
        setUser(data);
      } catch (err) {
        setError((err as Error).message || 'Kích hoạt không thành công. Token có thể đã hết hạn hoặc không hợp lệ.');
      } finally {
        setLoading(false);
      }
    };

    doVerify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResendLoading(true);
    try {
      await apiClient('/api/v1/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email: resendEmail }),
      });
      setResendSuccess(true);
      toast.success('Đã gửi lại email kích hoạt! Vui lòng kiểm tra hòm thư.');
    } catch (err) {
      toast.error((err as Error).message || 'Không thể gửi lại email kích hoạt.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl dark:border dark:border-slate-800 dark:bg-slate-900 text-center">
        
        {/* Brand */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/20 mb-4">
          <Utensils className="h-6 w-6" />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-8 space-y-3">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Đang xác thực liên kết kích hoạt...
            </h3>
            <p className="text-xs text-slate-500">Vui lòng đợi trong giây lát</p>
          </div>
        )}

        {/* Success state */}
        {!loading && success && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Kích Hoạt Email Thành Công!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Địa chỉ email <strong>{user?.email}</strong> đã được xác thực an toàn.
            </p>

            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-left text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              <p className="font-semibold text-sm mb-1">⏳ Chờ Quản Trị Viên Phê Duyệt Hồ Sơ</p>
              <p>
                Hồ sơ của bạn với vai trò <strong>{user?.requestedRole}</strong> hiện đang nằm trong danh sách chờ duyệt của Ban Quản Trị. 
                Bạn sẽ nhận được email thông báo ngay khi tài khoản được mở quyền truy cập hệ thống.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition"
              >
                Đến trang Đăng nhập
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && !success && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <XCircle className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Xác Thực Không Thành Công
            </h2>
            <p className="text-sm text-rose-600 dark:text-rose-400">
              {error}
            </p>

            {/* Resend box */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-800 dark:bg-slate-800/40">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Yêu cầu gửi lại link kích hoạt mới
              </h4>
              {resendSuccess ? (
                <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  ✅ Đã gửi lại link kích hoạt mới! Vui lòng kiểm tra hòm thư của bạn.
                </p>
              ) : (
                <form onSubmit={handleResend} className="mt-3 space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Nhập email của bạn"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs shadow-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="w-full rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition"
                  >
                    {resendLoading ? 'Đang gửi...' : 'Gửi link kích hoạt mới'}
                  </button>
                </form>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="text-xs font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-400"
              >
                Quay lại trang Đăng nhập
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
