'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import {
  User,
  AdminStats,
  AccountWarning,
  PageResponse,
  ROLE_LABELS
} from '@/types';
import {
  Shield,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Award,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  Building,
  Check,
  X,
  MessageSquare,
  Eye,
  ShieldCheck,
  ChevronRight,
  Send,
  Calendar
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { useToast } from '@/context/ToastContext';

export default function AdminDashboardPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'badges' | 'warnings'>('pending');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // All Users Tab state
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [selectedLockedFilter, setSelectedLockedFilter] = useState<string>('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Pending queues
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);

  const [badgeRequests, setBadgeRequests] = useState<User[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(false);

  const [warningLogs, setWarningLogs] = useState<AccountWarning[]>([]);
  const [loadingWarnings, setLoadingWarnings] = useState(false);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningTitle, setWarningTitle] = useState('');
  const [warningContent, setWarningContent] = useState('');
  const [submittingWarning, setSubmittingWarning] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submittingReject, setSubmittingReject] = useState(false);

  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [userToLock, setUserToLock] = useState<User | null>(null);
  const [lockReason, setLockReason] = useState('Vi phạm quy định hệ thống');
  const [submittingLock, setSubmittingLock] = useState(false);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [userWarningsList, setUserWarningsList] = useState<AccountWarning[]>([]);

  // Permission check
  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const data = await apiClient<AdminStats>('/api/v1/admin/stats');
      setStats(data);
    } catch (err) {
      console.error('Lỗi khi tải thống kê:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Load pending approvals
  const fetchPendingUsers = useCallback(async () => {
    try {
      setLoadingPending(true);
      const data = await apiClient<User[]>('/api/v1/admin/pending-approvals');
      setPendingUsers(data);
    } catch (err) {
      console.error('Lỗi tải danh sách chờ duyệt:', err);
    } finally {
      setLoadingPending(false);
    }
  }, []);

  // Load badge requests
  const fetchBadgeRequests = useCallback(async () => {
    try {
      setLoadingBadges(true);
      const data = await apiClient<User[]>('/api/v1/admin/pending-badges');
      setBadgeRequests(data);
    } catch (err) {
      console.error('Lỗi tải yêu cầu tích xanh:', err);
    } finally {
      setLoadingBadges(false);
    }
  }, []);

  // Load warnings
  const fetchWarnings = useCallback(async () => {
    try {
      setLoadingWarnings(true);
      const data = await apiClient<AccountWarning[]>('/api/v1/admin/warnings');
      setWarningLogs(data);
    } catch (err) {
      console.error('Lỗi tải nhật ký cảnh báo:', err);
    } finally {
      setLoadingWarnings(false);
    }
  }, []);

  // Load all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', '10');
      if (searchKeyword.trim()) params.append('search', searchKeyword.trim());
      if (selectedRoleFilter) params.append('role', selectedRoleFilter);
      if (selectedStatusFilter) params.append('status', selectedStatusFilter);
      if (selectedLockedFilter !== '') params.append('locked', selectedLockedFilter);

      const data = await apiClient<PageResponse<User>>(`/api/v1/admin/users?${params.toString()}`);
      setUsers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, [page, searchKeyword, selectedRoleFilter, selectedStatusFilter, selectedLockedFilter]);

  // Initial load
  useEffect(() => {
    if (!authLoading && currentUser) {
      if (!isAdmin) {
        // Not admin
        return;
      }
      fetchStats();
      fetchPendingUsers();
      fetchBadgeRequests();
    }
  }, [authLoading, currentUser, isAdmin, fetchStats, fetchPendingUsers, fetchBadgeRequests]);

  // Tab switch effect
  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === 'all') {
      fetchUsers();
    } else if (activeTab === 'pending') {
      fetchPendingUsers();
    } else if (activeTab === 'badges') {
      fetchBadgeRequests();
    } else if (activeTab === 'warnings') {
      fetchWarnings();
    }
  }, [activeTab, isAdmin, fetchUsers, fetchPendingUsers, fetchBadgeRequests, fetchWarnings]);

  // Handle Approve
  const handleApprove = async (userId: number) => {
    try {
      await apiClient(`/api/v1/admin/users/${userId}/approve`, { method: 'POST' });
      fetchPendingUsers();
      fetchStats();
      if (activeTab === 'all') fetchUsers();
      toast.success('Đã phê duyệt tài khoản thành công! Email thông báo đã được gửi.');
    } catch (err) {
      toast.error((err as Error).message || 'Lỗi khi phê duyệt tài khoản');
    }
  };

  // Open Reject Modal
  const handleOpenReject = (user: User) => {
    setSelectedUser(user);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedUser) return;
    try {
      setSubmittingReject(true);
      await apiClient(`/api/v1/admin/users/${selectedUser.id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason: rejectionReason }),
      });
      setRejectModalOpen(false);
      fetchPendingUsers();
      fetchStats();
      if (activeTab === 'all') fetchUsers();
      toast.success('Đã từ chối tài khoản thành công.');
    } catch (err) {
      toast.error((err as Error).message || 'Lỗi khi từ chối tài khoản');
    } finally {
      setSubmittingReject(false);
    }
  };

  // Lock / Unlock with custom Modal
  const handleToggleLock = async (user: User) => {
    if (user.locked) {
      try {
        await apiClient(`/api/v1/admin/users/${user.id}/unlock`, { method: 'POST' });
        toast.success(`Đã mở khóa tài khoản ${user.email}`);
        fetchUsers();
        fetchStats();
      } catch (err) {
        toast.error((err as Error).message || 'Lỗi khi mở khóa tài khoản');
      }
    } else {
      setUserToLock(user);
      setLockReason('Vi phạm quy định hệ thống');
      setLockModalOpen(true);
    }
  };

  const handleConfirmLock = async () => {
    if (!userToLock) return;
    try {
      setSubmittingLock(true);
      await apiClient(`/api/v1/admin/users/${userToLock.id}/lock`, {
        method: 'POST',
        body: JSON.stringify({ reason: lockReason }),
      });
      setLockModalOpen(false);
      toast.success(`Đã khóa tài khoản ${userToLock.email}`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      toast.error((err as Error).message || 'Lỗi khi khóa tài khoản');
    } finally {
      setSubmittingLock(false);
    }
  };

  // Approve / Revoke Verified Badge
  const handleToggleBadge = async (userId: number, currentBadge: boolean) => {
    try {
      if (currentBadge) {
        await apiClient(`/api/v1/admin/users/${userId}/revoke-badge`, { method: 'POST' });
        toast.info('Đã thu hồi tích xanh tài khoản.');
      } else {
        await apiClient(`/api/v1/admin/users/${userId}/approve-badge`, { method: 'POST' });
        toast.success('Đã cấp tích xanh xác thực thành công!');
      }
      fetchUsers();
      fetchBadgeRequests();
      fetchStats();
    } catch (err) {
      toast.error((err as Error).message || 'Thao tác cấp/thu hồi tích xanh không thành công');
    }
  };

  // Send Warning
  const handleOpenWarning = (user: User) => {
    setSelectedUser(user);
    setWarningTitle('Cảnh báo vi phạm quy chế bán trú');
    setWarningContent('');
    setWarningModalOpen(true);
  };

  const handleSendWarning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !warningTitle || !warningContent) return;

    try {
      setSubmittingWarning(true);
      await apiClient(`/api/v1/admin/users/${selectedUser.id}/warn`, {
        method: 'POST',
        body: JSON.stringify({ title: warningTitle, content: warningContent }),
      });
      setWarningModalOpen(false);
      toast.success(`Đã gửi cảnh báo tới ${selectedUser.fullName} (${selectedUser.email})`);
      if (activeTab === 'all') fetchUsers();
      if (activeTab === 'warnings') fetchWarnings();
    } catch (err) {
      toast.error((err as Error).message || 'Không thể gửi cảnh báo');
    } finally {
      setSubmittingWarning(false);
    }
  };

  // Open Details Modal
  const handleOpenDetails = async (user: User) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
    try {
      const warnings = await apiClient<AccountWarning[]>(`/api/v1/admin/users/${user.id}/warnings`);
      setUserWarningsList(warnings);
    } catch (err) {
      console.error(err);
    }
  };

  // Not authenticated or not admin state (Safe Hydration Guard)
  if (!mounted || authLoading) {
    return (
      <div suppressHydrationWarning className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            Quyền Truy Cập Bị Giới Hạn
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Trang Dashboard Quản Trị chỉ dành riêng cho tài khoản có vai trò Quản Trị Viên (ROLE_ADMIN).
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/')}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  Admin Dashboard - Quản Trị Tài Khoản
                </h1>
                <p className="text-xs text-slate-500">
                  Phê duyệt hồ sơ, kiểm duyệt chức danh, cấp tích xanh & xử lý cảnh báo vi phạm
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <button
              onClick={() => {
                fetchStats();
                if (activeTab === 'pending') fetchPendingUsers();
                if (activeTab === 'all') fetchUsers();
                if (activeTab === 'badges') fetchBadgeRequests();
                if (activeTab === 'warnings') fetchWarnings();
              }}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Làm mới dữ liệu</span>
            </button>
          </div>
        </div>

        {/* 5 Stats Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {/* Total Users */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tổng tài khoản</span>
              <Users className="h-5 w-5 text-slate-400" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalUsers ?? '...'}
            </div>
            <span className="text-[11px] text-slate-400">Toàn hệ thống</span>
          </div>

          {/* Pending Approvals */}
          <div
            onClick={() => setActiveTab('pending')}
            className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition-all ${
              activeTab === 'pending'
                ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 dark:border-amber-600 dark:bg-amber-950/20'
                : 'border-slate-200 bg-white hover:border-amber-300 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Chờ phê duyệt</span>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {stats?.pendingApprovals ?? '...'}
            </div>
            <span className="text-[11px] text-amber-600/80">Cần xử lý ngay</span>
          </div>

          {/* Verified Badges */}
          <div
            onClick={() => setActiveTab('badges')}
            className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition-all ${
              activeTab === 'badges'
                ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 dark:border-blue-600 dark:bg-blue-950/20'
                : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Tích xanh đã cấp</span>
              <Award className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {stats?.verifiedBadgeCount ?? '...'}
            </div>
            <span className="text-[11px] text-blue-600/80">
              {stats?.pendingBadgeRequests ? `+${stats.pendingBadgeRequests} yêu cầu mới` : 'Đã xác thực'}
            </span>
          </div>

          {/* Locked Users */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">Đã khóa</span>
              <Lock className="h-5 w-5 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {stats?.lockedUsers ?? '...'}
            </div>
            <span className="text-[11px] text-rose-600/80">Bị đình chỉ quyền</span>
          </div>

          {/* Approved Users */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Đang hoạt động</span>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats?.approvedUsers ?? '...'}
            </div>
            <span className="text-[11px] text-emerald-600/80">Hợp lệ & chuẩn hóa</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex space-x-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'pending'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Chờ Phê Duyệt</span>
            {pendingUsers.length > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                {pendingUsers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Tất Cả Tài Khoản</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'badges'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Yêu Cầu Tích Xanh</span>
            {badgeRequests.length > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                {badgeRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('warnings')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'warnings'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Nhật Ký Cảnh Báo</span>
          </button>
        </div>

        {/* TAB 1: PENDING APPROVALS */}
        {activeTab === 'pending' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Danh sách tài khoản đang chờ phê duyệt ({pendingUsers.length})
              </h2>
              <span className="text-xs text-slate-500">
                Chỉ những tài khoản đã xác thực email mới được duyệt vào hệ thống
              </span>
            </div>

            {loadingPending ? (
              <div className="py-12 text-center">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-600" />
                <p className="mt-2 text-xs text-slate-500">Đang tải danh sách...</p>
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                  Tuyệt vời! Không có tài khoản nào chờ duyệt
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Tất cả hồ sơ đăng ký đã được kiểm duyệt hoàn tất.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingUsers.map((item) => {
                  const roleMeta = ROLE_LABELS[item.requestedRole || ''] || ROLE_LABELS['ROLE_USER'];
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
                    >
                      <div>
                        {/* Role & Email verified badge */}
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center space-x-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${roleMeta.color}`}>
                            <span>{roleMeta.icon}</span>
                            <span>{roleMeta.label}</span>
                          </span>

                          {item.emailVerified ? (
                            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Email đã xác thực</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Chưa click email</span>
                            </span>
                          )}
                        </div>

                        {/* Name & Email */}
                        <div className="mt-3">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {item.fullName}
                          </h3>
                          <div className="mt-1 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                            <p className="flex items-center space-x-1.5">
                              <Mail className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{item.email}</span>
                            </p>
                            {item.phoneNumber && (
                              <p className="flex items-center space-x-1.5">
                                <Phone className="h-3.5 w-3.5 shrink-0" />
                                <span>{item.phoneNumber}</span>
                              </p>
                            )}
                            {item.organization && (
                              <p className="flex items-center space-x-1.5">
                                <Building className="h-3.5 w-3.5 shrink-0" />
                                <span>{item.organization}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="flex-1 inline-flex items-center justify-center space-x-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Phê duyệt</span>
                        </button>
                        <button
                          onClick={() => handleOpenReject(item)}
                          className="inline-flex items-center justify-center space-x-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 transition"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Từ chối</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL USERS MANAGEMENT */}
        {activeTab === 'all' && (
          <div className="mt-6 space-y-4">
            {/* Filter Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm tên, email, SĐT..."
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      setPage(0);
                    }}
                    className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3.5 text-xs shadow-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Role filter */}
                <div>
                  <select
                    value={selectedRoleFilter}
                    onChange={(e) => {
                      setSelectedRoleFilter(e.target.value);
                      setPage(0);
                    }}
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs shadow-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">Tất cả vai trò</option>
                    <option value="ROLE_SUPPLIER">🏢 Nhà cung cấp</option>
                    <option value="ROLE_TEACHER">👩‍🏫 Giáo viên</option>
                    <option value="ROLE_GATE_INSPECTOR">🔍 Cán bộ kiểm duyệt</option>
                    <option value="ROLE_WARD_OFFICER">🏛️ Cán bộ phường</option>
                    <option value="ROLE_PRINCIPAL">🎓 Hiệu trưởng</option>
                    <option value="ROLE_PARENT">👨‍👩‍👧 Phụ huynh</option>
                    <option value="ROLE_ADMIN">🛡️ Quản trị viên</option>
                  </select>
                </div>

                {/* Status filter */}
                <div>
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => {
                      setSelectedStatusFilter(e.target.value);
                      setPage(0);
                    }}
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs shadow-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">Tất cả trạng thái duyệt</option>
                    <option value="APPROVED">Đã phê duyệt (APPROVED)</option>
                    <option value="PENDING">Chờ phê duyệt (PENDING)</option>
                    <option value="REJECTED">Bị từ chối (REJECTED)</option>
                  </select>
                </div>

                {/* Lock status filter */}
                <div>
                  <select
                    value={selectedLockedFilter}
                    onChange={(e) => {
                      setSelectedLockedFilter(e.target.value);
                      setPage(0);
                    }}
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs shadow-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">Tình trạng khóa</option>
                    <option value="false">Đang hoạt động</option>
                    <option value="true">Đã bị khóa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3">Người Dùng</th>
                      <th className="px-3 py-3.5">Liên Hệ</th>
                      <th className="px-3 py-3.5">Vai Trò</th>
                      <th className="px-3 py-3.5">Trạng Thái</th>
                      <th className="px-3 py-3.5">Cảnh Báo</th>
                      <th className="px-3 py-3.5 text-right pr-4">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-600 mb-2" />
                          Đang tải dữ liệu người dùng...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          Không tìm thấy người dùng nào phù hợp với bộ lọc
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => {
                        const primaryRole = u.roles?.[0] || u.requestedRole || 'ROLE_USER';
                        const roleMeta = ROLE_LABELS[primaryRole] || ROLE_LABELS['ROLE_USER'];

                        return (
                          <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                            {/* User column */}
                            <td className="py-3.5 pl-4 pr-3">
                              <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold dark:bg-emerald-950 dark:text-emerald-300">
                                  {u.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                                    <span>{u.fullName}</span>
                                    {u.verifiedBadge && (
                                      <VerifiedBadge className="h-4 w-4" />
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-400">ID: #{u.id}</span>
                                </div>
                              </div>
                            </td>

                            {/* Contact column */}
                            <td className="px-3 py-3.5">
                              <div className="text-slate-700 dark:text-slate-300 font-medium">
                                {u.email}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {u.phoneNumber || 'Chưa có SĐT'}
                              </div>
                            </td>

                            {/* Role column */}
                            <td className="px-3 py-3.5">
                              <span className={`inline-flex items-center space-x-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${roleMeta.color}`}>
                                <span>{roleMeta.icon}</span>
                                <span>{roleMeta.label}</span>
                              </span>
                            </td>

                            {/* Status column */}
                            <td className="px-3 py-3.5">
                              <div className="space-y-1">
                                {u.approvalStatus === 'APPROVED' ? (
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    Đã duyệt
                                  </span>
                                ) : u.approvalStatus === 'PENDING' ? (
                                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
                                    Chờ duyệt
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
                                    Từ chối
                                  </span>
                                )}

                                {u.locked ? (
                                  <div>
                                    <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                                      Đang bị khóa
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            </td>

                            {/* Warning count */}
                            <td className="px-3 py-3.5">
                              {(u.warningCount ?? 0) > 0 ? (
                                <span className="inline-flex items-center space-x-1 text-amber-600 font-bold">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  <span>{u.warningCount} lần</span>
                                </span>
                              ) : (
                                <span className="text-slate-400">0</span>
                              )}
                            </td>

                            {/* Actions column */}
                            <td className="px-3 py-3.5 text-right pr-4">
                              <div className="flex items-center justify-end space-x-1.5">
                                {/* Details */}
                                <button
                                  onClick={() => handleOpenDetails(u)}
                                  title="Xem chi tiết"
                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>

                                {/* Send warning */}
                                <button
                                  onClick={() => handleOpenWarning(u)}
                                  title="Gửi cảnh báo"
                                  className="rounded-lg p-1.5 text-amber-500 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40"
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                </button>

                                {/* Verified badge toggle */}
                                <button
                                  onClick={() => handleToggleBadge(u.id, !!u.verifiedBadge)}
                                  title={u.verifiedBadge ? 'Thu hồi tích xanh' : 'Cấp tích xanh'}
                                  className={`rounded-lg p-1.5 ${
                                    u.verifiedBadge
                                      ? 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                                      : 'text-slate-300 hover:bg-slate-100 hover:text-blue-500 dark:hover:bg-slate-800'
                                  }`}
                                >
                                  <Award className="h-4 w-4" />
                                </button>

                                {/* Lock / Unlock */}
                                <button
                                  onClick={() => handleToggleLock(u)}
                                  title={u.locked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                                  className={`rounded-lg p-1.5 ${
                                    u.locked
                                      ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                                      : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800'
                                  }`}
                                >
                                  {u.locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-800">
                  <span className="text-xs text-slate-500">
                    Hiển thị {users.length} trên tổng số {totalElements} tài khoản
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={page === 0}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                      className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
                    >
                      Trang trước
                    </button>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((prev) => prev + 1)}
                      className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
                    >
                      Trang sau
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: VERIFIED BADGE REQUESTS */}
        {activeTab === 'badges' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Danh sách đề xuất cấp tích xanh xác thực ({badgeRequests.length})
              </h2>
              <span className="text-xs text-slate-500">
                Tích xanh chứng nhận uy tín chuẩn cơ sở cung cấp và đại diện nhà trường
              </span>
            </div>

            {loadingBadges ? (
              <div className="py-12 text-center">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-600" />
              </div>
            ) : badgeRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <Award className="mx-auto h-12 w-12 text-blue-400" />
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                  Không có yêu cầu cấp tích xanh nào đang chờ
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badgeRequests.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm dark:border-blue-900/40 dark:bg-slate-900 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center space-x-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          <VerifiedBadge className="h-3.5 w-3.5" />
                          <span>Yêu cầu tích xanh</span>
                        </span>
                        <span className="text-[11px] text-slate-400">{item.organization}</span>
                      </div>

                      <div className="mt-3">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {item.fullName}
                        </h3>
                        <p className="text-xs text-slate-500">{item.email} • {item.phoneNumber}</p>
                      </div>

                      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                        <span className="font-semibold text-slate-900 dark:text-white">Lý do đề xuất: </span>
                        <span>{item.badgeRequestReason || 'Không có ghi chú'}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleBadge(item.id, false)}
                        className="flex-1 inline-flex items-center justify-center space-x-1 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Phê duyệt tích xanh</span>
                      </button>
                      <button
                        onClick={() => handleToggleBadge(item.id, true)}
                        className="inline-flex items-center justify-center space-x-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Bỏ qua</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WARNING LOGS */}
        {activeTab === 'warnings' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Lịch sử cảnh báo vi phạm ({warningLogs.length})
              </h2>
            </div>

            {loadingWarnings ? (
              <div className="py-12 text-center">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-600" />
              </div>
            ) : warningLogs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <AlertTriangle className="mx-auto h-12 w-12 text-amber-400" />
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                  Chưa có cảnh báo nào được gửi
                </h3>
              </div>
            ) : (
              <div className="space-y-3">
                {warningLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-amber-800 text-xs">
                          ⚠️
                        </span>
                        <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                          {log.warningTitle}
                        </h4>
                      </div>
                      <span suppressHydrationWarning className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-amber-900/90 dark:text-amber-300">
                      {log.warningContent}
                    </div>

                    <div className="mt-3 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Tài khoản nhận: <strong>{log.userFullName}</strong> ({log.userEmail})</span>
                      <span>Admin thực hiện: <strong>{log.adminFullName}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL 1: SEND WARNING */}
      {warningModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Gửi Cảnh Báo Vi Phạm
                </h3>
              </div>
              <button
                onClick={() => setWarningModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Cảnh báo sẽ được lưu vào lịch sử, hiển thị trực tiếp trên giao diện của người dùng và gửi thông báo qua Gmail.
            </p>

            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Gửi tới: <strong>{selectedUser.fullName}</strong> ({selectedUser.email})
            </div>

            <form onSubmit={handleSendWarning} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tiêu đề cảnh báo
                </label>
                <input
                  type="text"
                  required
                  value={warningTitle}
                  onChange={(e) => setWarningTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 py-2 px-3 text-xs shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nội dung chi tiết vi phạm
                </label>
                <textarea
                  required
                  rows={4}
                  value={warningContent}
                  onChange={(e) => setWarningContent(e.target.value)}
                  placeholder="Mô tả cụ thể hành vi vi phạm (ví dụ: giao trễ giờ, nhiệt độ không đạt chuẩn 60°C, ảnh thiếu rõ nét)..."
                  className="mt-1 w-full rounded-xl border border-slate-200 py-2 px-3 text-xs shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-5 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setWarningModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingWarning}
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-amber-500 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submittingWarning ? 'Đang gửi...' : 'Phát Cảnh Báo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REJECT USER */}
      {rejectModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-rose-600">
              Từ Chối Hồ Sơ Đăng Ký
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Hồ sơ của <strong>{selectedUser.fullName}</strong> ({selectedUser.email}) sẽ chuyển sang trạng thái REJECTED.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Lý do từ chối (Gửi vào email người dùng)
              </label>
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ví dụ: Thiếu giấy phép kinh doanh, số điện thoại không liên lạc được..."
                className="mt-1 w-full rounded-xl border border-slate-200 py-2 px-3 text-xs shadow-sm focus:border-rose-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="mt-5 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={submittingReject}
                onClick={handleConfirmReject}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-500 disabled:opacity-50"
              >
                {submittingReject ? 'Đang xử lý...' : 'Xác Nhận Từ Chối'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: USER DETAILS */}
      {detailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Hồ Sơ Chi Tiết Người Dùng
                {selectedUser.verifiedBadge && (
                  <VerifiedBadge className="h-4 w-4" />
                )}
              </h3>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl dark:bg-slate-800">
                <div>
                  <span className="text-slate-400 block">Họ và tên:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedUser.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Email:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Số điện thoại:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedUser.phoneNumber || 'Chưa cung cấp'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Vai trò:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedUser.roles?.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Đơn vị / Cơ sở:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedUser.organization || 'Chưa cập nhật'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Địa chỉ:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedUser.address || 'Chưa cập nhật'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Trạng thái duyệt:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedUser.approvalStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tích xanh xác thực:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    {selectedUser.verifiedBadge ? (
                      <>
                        <VerifiedBadge className="h-3.5 w-3.5" />
                        <span>Đã cấp</span>
                      </>
                    ) : (
                      'Chưa cấp'
                    )}
                  </span>
                </div>
              </div>

              {/* Warning history for this user */}
              <div className="pt-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-2">
                  Lịch sử cảnh báo vi phạm ({userWarningsList.length})
                </h4>
                {userWarningsList.length === 0 ? (
                  <p className="text-slate-400 italic">Tài khoản này chưa từng bị cảnh báo.</p>
                ) : (
                  <div className="space-y-2">
                    {userWarningsList.map((w) => (
                      <div key={w.id} className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 text-[11px] dark:border-amber-900/50 dark:bg-amber-950/20">
                        <div className="font-bold text-amber-900 dark:text-amber-200">{w.warningTitle}</div>
                        <div className="text-amber-800 dark:text-amber-300 mt-0.5">{w.warningContent}</div>
                        <div suppressHydrationWarning className="text-[10px] text-slate-400 mt-1">
                          {new Date(w.createdAt).toLocaleString('vi-VN')} bởi {w.adminFullName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: LOCK ACCOUNT */}
      {lockModalOpen && userToLock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Khóa Tài Khoản Người Dùng
                  </h3>
                  <p className="text-xs text-slate-500">{userToLock.fullName} ({userToLock.email})</p>
                </div>
              </div>
              <button
                onClick={() => setLockModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lý do khóa tài khoản:
                </label>
                <textarea
                  rows={3}
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                  placeholder="Nhập lý do vi phạm hoặc đình chỉ hoạt động..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setLockModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLock}
                  disabled={submittingLock}
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-500 disabled:opacity-50 transition"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{submittingLock ? 'Đang khóa...' : 'Xác nhận khóa'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
