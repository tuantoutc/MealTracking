'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { User as UserType } from '@/types';
import {
  Utensils,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Building2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface RoleOption {
  id: string;
  label: string;
  sub: string;
  icon: string;
}

const REGISTRATION_ROLES: RoleOption[] = [
  { id: 'ROLE_SUPPLIER', label: 'Nhà cung cấp', sub: 'Bếp trung tâm, xuất ăn & xe vận chuyển', icon: '🏢' },
  { id: 'ROLE_TEACHER', label: 'Giáo viên', sub: 'Tiếp nhận lớp, chụp ảnh khay cơm', icon: '👩‍🏫' },
  { id: 'ROLE_GATE_INSPECTOR', label: 'Cán bộ kiểm duyệt', sub: 'Kiểm tra nhiệt độ > 60°C & nhận hàng', icon: '🔍' },
  { id: 'ROLE_WARD_OFFICER', label: 'Cán bộ phường', sub: 'Giám sát ATTP & y tế địa phương', icon: '🏛️' },
  { id: 'ROLE_PRINCIPAL', label: 'Hiệu trưởng', sub: 'Ban giám hiệu, giám sát toàn diện', icon: '🎓' },
  { id: 'ROLE_PARENT', label: 'Phụ huynh', sub: 'Theo dõi suất ăn con em & đánh giá', icon: '👨‍👩‍👧' },
];

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [organization, setOrganization] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('ROLE_PARENT');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<UserType | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiClient<UserType>('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          email,
          phoneNumber,
          organization,
          address,
          password,
          role: selectedRole,
        }),
      });
      setSuccessData(response);
    } catch (err) {
      setError((err as Error).message || 'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:border dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
            <Utensils className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Đăng ký tài khoản MealTrace
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Hệ thống giám sát suất ăn học đường đa chủ thể & minh bạch chuỗi cung ứng
          </p>
        </div>

        {/* Success screen */}
        {successData ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-emerald-900 dark:text-emerald-200">
              Đăng Ký Thành Công & Đang Chờ Phê Duyệt!
            </h3>
            <p className="mt-2 text-sm text-emerald-800/90 dark:text-emerald-300">
              Hệ thống đã gửi liên kết kích hoạt đến địa chỉ: <strong>{successData.email}</strong>
            </p>

            <div className="mt-5 rounded-xl bg-white p-4 text-left shadow-sm dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quy trình 2 bước kích hoạt:</h4>
              <ol className="mt-2 space-y-2 text-xs text-slate-700 dark:text-slate-300 list-decimal list-inside">
                <li>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Bước 1:</span> Mở hòm thư Gmail và nhấn vào nút <strong>Xác Nhận & Kích Hoạt Email</strong>.
                </li>
                <li>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Bước 2:</span> Sau khi email được xác nhận, hồ sơ của bạn với vai trò <span className="font-bold underline">{successData.requestedRole}</span> sẽ được <strong>Admin kiểm duyệt và phê duyệt</strong>.
                </li>
              </ol>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition"
              >
                Đến trang Đăng nhập
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <>
            {error && (
              <div className="flex items-center space-x-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  1. Chọn vai trò của bạn trong hệ thống <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {REGISTRATION_ROLES.map((role) => {
                    const isSelected = selectedRole === role.id;
                    return (
                      <div
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`cursor-pointer rounded-xl border p-3 transition-all flex items-start space-x-3 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/60 shadow-sm ring-1 ring-emerald-500 dark:border-emerald-500 dark:bg-emerald-950/30'
                            : 'border-slate-200 hover:border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800/60'
                        }`}
                      >
                        <span className="text-xl shrink-0 mt-0.5">{role.icon}</span>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {role.label}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.2 rounded-full">
                                Đã chọn
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {role.sub}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal Details */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  2. Thông tin cá nhân & Liên hệ <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Họ và tên
                    </label>
                    <div className="relative mt-1">
                      <UserIcon className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Số điện thoại
                    </label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0912345678"
                        className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Email (Nhận mã kích hoạt)
                    </label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tenban@gmail.com"
                        className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Mật khẩu (Tối thiểu 6 ký tự)
                    </label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Đơn vị / Trường học / Doanh nghiệp
                    </label>
                    <div className="relative mt-1">
                      <Building2 className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="THCS Chu Văn An / Bếp Hương Sen..."
                        className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Địa chỉ liên hệ
                    </label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Số 10 Lý Thường Kiệt, Hoàn Kiếm..."
                        className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300 flex items-start space-x-2">
                <Sparkles className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  <strong>Chính sách bảo vệ an toàn bán trú:</strong> Sau khi gửi yêu cầu, bạn cần kích hoạt link trong email và chờ Quản trị viên duyệt hồ sơ trước khi có thể đăng nhập.
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-2.5 px-4 text-sm font-semibold text-white shadow-md hover:from-emerald-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 transition"
              >
                {loading ? 'Đang gửi hồ sơ đăng ký...' : 'Gửi yêu cầu đăng ký & Nhận link kích hoạt'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Đã có tài khoản?{' '}
              <Link
                href="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
