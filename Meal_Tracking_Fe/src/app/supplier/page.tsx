'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { useToast } from '@/context/ToastContext';
import { apiClient } from '@/lib/api';
import {
  FoodPartner,
  FoodPartnerSummary,
  SupplierClient,
  SupplierClientSummary,
  SupplierSummary,
  PageResponse,
  PartnerCategory,
  PartnerStatus,
  ClientType,
  ClientStatus,
  PARTNER_CATEGORIES,
  PARTNER_STATUSES,
  CLIENT_TYPES,
  CLIENT_STATUSES
} from '@/types';
import { PartnerModal } from '@/components/supplier/PartnerModal';
import { ClientModal } from '@/components/supplier/ClientModal';
import { PartnerDetailModal } from '@/components/supplier/PartnerDetailModal';
import { ClientDetailModal } from '@/components/supplier/ClientDetailModal';
import { ContractPdfModal } from '@/components/supplier/ContractPdfModal';
import {
  Truck,
  Building2,
  School,
  PlusCircle,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Package,
  FileText,
  FileCheck,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Award,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  ShieldCheck,
  Send,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function SupplierDashboardPage() {
  const { user, updateCurrentUser, refreshUser } = useAuth();
  const { toast } = useToast();

  const [activeMainTab, setActiveMainTab] = useState<'partners' | 'clients' | 'overview'>('partners');
  const [summary, setSummary] = useState<SupplierSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Partners state
  const [partners, setPartners] = useState<FoodPartnerSummary[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState('');
  const [selectedPartnerCategory, setSelectedPartnerCategory] = useState<string>('');
  const [selectedPartnerStatus, setSelectedPartnerStatus] = useState<string>('');
  const [partnerPage, setPartnerPage] = useState<number>(0);
  const [partnerTotalPages, setPartnerTotalPages] = useState<number>(0);
  const [partnerTotalElements, setPartnerTotalElements] = useState<number>(0);
  const partnerPageSize = 10;

  // Clients state
  const [clients, setClients] = useState<SupplierClientSummary[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientType, setSelectedClientType] = useState<string>('');
  const [selectedClientStatus, setSelectedClientStatus] = useState<string>('');
  const [clientPage, setClientPage] = useState<number>(0);
  const [clientTotalPages, setClientTotalPages] = useState<number>(0);
  const [clientTotalElements, setClientTotalElements] = useState<number>(0);
  const clientPageSize = 10;

  // Modals state
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<FoodPartner | null>(null);

  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<SupplierClient | null>(null);

  const [partnerDetailOpen, setPartnerDetailOpen] = useState(false);
  const [viewingPartner, setViewingPartner] = useState<FoodPartner | null>(null);

  const [clientDetailOpen, setClientDetailOpen] = useState(false);
  const [viewingClient, setViewingClient] = useState<SupplierClient | null>(null);

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfClient, setPdfClient] = useState<SupplierClient | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'partner' | 'client'; id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Badge request modal
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [badgeReason, setBadgeReason] = useState('Đơn vị cung cấp suất ăn bán trú đạt chuẩn VSATTP');
  const [submittingBadge, setSubmittingBadge] = useState(false);

  const isVerified = !!user?.verifiedBadge;
  const isBadgeRequested = !!user?.badgeRequested;

  // Fetch summary
  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const data = await apiClient<SupplierSummary>('/api/v1/supplier/summary');
      setSummary(data);
    } catch {
      // fallback calculation if offline or unauthenticated
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // Fetch partners
  const fetchPartners = useCallback(async (targetPage = partnerPage) => {
    try {
      setLoadingPartners(true);
      const params = new URLSearchParams();
      if (selectedPartnerCategory) params.append('category', selectedPartnerCategory);
      if (selectedPartnerStatus) params.append('status', selectedPartnerStatus);
      if (partnerSearch.trim()) params.append('search', partnerSearch.trim());
      params.append('page', String(targetPage));
      params.append('size', String(partnerPageSize));

      const data = await apiClient<PageResponse<FoodPartnerSummary>>(`/api/v1/supplier/partners?${params.toString()}`);
      setPartners(data.content || []);
      setPartnerTotalPages(data.totalPages || 0);
      setPartnerTotalElements(data.totalElements || 0);
      setPartnerPage(data.number || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPartners(false);
    }
  }, [selectedPartnerCategory, selectedPartnerStatus, partnerSearch, partnerPage, partnerPageSize]);

  // Fetch clients
  const fetchClients = useCallback(async (targetPage = clientPage) => {
    try {
      setLoadingClients(true);
      const params = new URLSearchParams();
      if (selectedClientType) params.append('clientType', selectedClientType);
      if (selectedClientStatus) params.append('status', selectedClientStatus);
      if (clientSearch.trim()) params.append('search', clientSearch.trim());
      params.append('page', String(targetPage));
      params.append('size', String(clientPageSize));

      const data = await apiClient<PageResponse<SupplierClientSummary>>(`/api/v1/supplier/clients?${params.toString()}`);
      setClients(data.content || []);
      setClientTotalPages(data.totalPages || 0);
      setClientTotalElements(data.totalElements || 0);
      setClientPage(data.number || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClients(false);
    }
  }, [selectedClientType, selectedClientStatus, clientSearch, clientPage, clientPageSize]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchPartners(0);
  }, [selectedPartnerCategory, selectedPartnerStatus, partnerSearch]);

  useEffect(() => {
    fetchClients(0);
  }, [selectedClientType, selectedClientStatus, clientSearch]);

  // Detail / Edit handlers using specific Detail API
  const handleViewPartnerDetail = async (id: number) => {
    try {
      const data = await apiClient<FoodPartner>(`/api/v1/supplier/partners/${id}`);
      setViewingPartner(data);
      setPartnerDetailOpen(true);
    } catch (err) {
      toast.error((err as Error).message || 'Không thể tải chi tiết đối tác');
    }
  };

  const handleEditPartner = async (id: number) => {
    try {
      const data = await apiClient<FoodPartner>(`/api/v1/supplier/partners/${id}`);
      setEditingPartner(data);
      setPartnerModalOpen(true);
    } catch (err) {
      toast.error((err as Error).message || 'Không thể tải thông tin đối tác');
    }
  };

  const handleViewClientDetail = async (id: number) => {
    try {
      const data = await apiClient<SupplierClient>(`/api/v1/supplier/clients/${id}`);
      setViewingClient(data);
      setClientDetailOpen(true);
    } catch (err) {
      toast.error((err as Error).message || 'Không thể tải chi tiết khách hàng');
    }
  };

  const handleEditClient = async (id: number) => {
    try {
      const data = await apiClient<SupplierClient>(`/api/v1/supplier/clients/${id}`);
      setEditingClient(data);
      setClientModalOpen(true);
    } catch (err) {
      toast.error((err as Error).message || 'Không thể tải thông tin khách hàng');
    }
  };

  // Partner CRUD
  const handleSavePartner = async (partnerData: Partial<FoodPartner>) => {
    try {
      if (editingPartner) {
        await apiClient(`/api/v1/supplier/partners/${editingPartner.id}`, {
          method: 'PUT',
          body: JSON.stringify(partnerData),
        });
        toast.success(`Cập nhật đối tác "${partnerData.name}" thành công!`);
      } else {
        await apiClient('/api/v1/supplier/partners', {
          method: 'POST',
          body: JSON.stringify(partnerData),
        });
        toast.success(`Thêm đối tác thực phẩm "${partnerData.name}" thành công!`);
      }
      fetchPartners(partnerPage);
      fetchSummary();
    } catch (err) {
      toast.error((err as Error).message || 'Lỗi khi lưu đối tác');
      throw err;
    }
  };

  // Client CRUD
  const handleSaveClient = async (clientData: Partial<SupplierClient>) => {
    try {
      if (editingClient) {
        await apiClient(`/api/v1/supplier/clients/${editingClient.id}`, {
          method: 'PUT',
          body: JSON.stringify(clientData),
        });
        toast.success(`Cập nhật khách hàng "${clientData.name}" thành công!`);
      } else {
        await apiClient('/api/v1/supplier/clients', {
          method: 'POST',
          body: JSON.stringify(clientData),
        });
        toast.success(`Thêm khách hàng "${clientData.name}" thành công!`);
      }
      fetchClients(clientPage);
      fetchSummary();
    } catch (err) {
      toast.error((err as Error).message || 'Lỗi khi lưu khách hàng');
      throw err;
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      if (deleteTarget.type === 'partner') {
        await apiClient(`/api/v1/supplier/partners/${deleteTarget.id}`, { method: 'DELETE' });
        toast.success(`Đã xóa đối tác thực phẩm "${deleteTarget.name}"`);
        fetchPartners(partnerPage);
      } else {
        await apiClient(`/api/v1/supplier/clients/${deleteTarget.id}`, { method: 'DELETE' });
        toast.success(`Đã xóa khách hàng "${deleteTarget.name}"`);
        fetchClients(clientPage);
      }
      setDeleteConfirmOpen(false);
      fetchSummary();
    } catch (err) {
      toast.error((err as Error).message || 'Không thể xóa mục này');
    } finally {
      setDeleting(false);
    }
  };

  // Request badge
  const handleRequestBadgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeReason.trim()) {
      toast.warning('Vui lòng nhập lý do hoặc mã số chứng nhận');
      return;
    }

    try {
      setSubmittingBadge(true);
      await apiClient('/api/v1/auth/request-badge', {
        method: 'POST',
        body: JSON.stringify({ reason: badgeReason.trim() }),
      });
      setBadgeModalOpen(false);
      updateCurrentUser({ badgeRequested: true, badgeRequestReason: badgeReason.trim() });
      await refreshUser();
      toast.success('Đã gửi đề xuất cấp tích xanh đến Quản trị viên!');
    } catch (err) {
      toast.error((err as Error).message || 'Không thể gửi yêu cầu');
    } finally {
      setSubmittingBadge(false);
    }
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-md shadow-amber-500/20">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                  <span>Cổng Thông Tin Nhà Cung Cấp Suất Ăn</span>
                  {/* Verified Badge Facebook style */}
                  {isVerified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <VerifiedBadge className="h-4 w-4" />
                      <span>Đã cấp tích xanh</span>
                    </span>
                  )}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {user?.organization ? `${user.organization} • ` : ''}
                  Quản lý chuỗi đối tác cung ứng thực phẩm, hợp đồng khách hàng trường học & logistics ca ăn
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* If NOT verified and NOT requested yet, show request button. If verified, NO button! */}
            {!isVerified && !isBadgeRequested && (
              <button
                onClick={() => setBadgeModalOpen(true)}
                className="inline-flex items-center space-x-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-xs font-bold text-blue-700 shadow-sm hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300 transition"
              >
                <Award className="h-4 w-4 text-blue-600" />
                <span>Xin tích xanh</span>
              </button>
            )}

            {!isVerified && isBadgeRequested && (
              <span className="inline-flex items-center space-x-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                <span>⏳ Đang chờ duyệt tích xanh</span>
              </span>
            )}

            <button
              onClick={() => {
                fetchSummary();
                if (activeMainTab === 'partners') fetchPartners();
                if (activeMainTab === 'clients') fetchClients();
              }}
              title="Làm mới dữ liệu"
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 4 Metrics Summary Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div
            onClick={() => setActiveMainTab('partners')}
            className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition ${
              activeMainTab === 'partners'
                ? 'border-emerald-500 bg-emerald-50/40 dark:border-emerald-500 dark:bg-emerald-950/20'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Đối tác thực phẩm</span>
              <Building2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              {summary ? summary.totalPartners : partnerTotalElements}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              {summary ? `${summary.activePartners} đối tác đang hợp tác` : 'Chuẩn VietGAP & ATTP'}
            </span>
          </div>

          <div
            onClick={() => setActiveMainTab('clients')}
            className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition ${
              activeMainTab === 'clients'
                ? 'border-blue-500 bg-blue-50/40 dark:border-blue-500 dark:bg-blue-950/20'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Khách hàng sử dụng</span>
              <School className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              {summary ? summary.totalClients : clientTotalElements}
            </div>
            <span className="text-[11px] text-blue-600 font-medium">
              {summary ? `${summary.activeClients} cơ sở đang phục vụ` : 'Trường học & Doanh nghiệp'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Suất ăn cam kết / ngày</span>
              <Package className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-amber-600">
              {summary && summary.totalDailyServings > 0
                ? summary.totalDailyServings.toLocaleString('vi-VN')
                : '1,650'}
            </div>
            <span className="text-[11px] text-slate-400">Giao bằng xe thùng giữ nhiệt</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Chuẩn an toàn ATTP</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-5 w-5" />
              <span>100% Đạt Chuẩn</span>
            </div>
            <span className="text-[11px] text-slate-400">HACCP Codex & ISO 22000</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 border-b border-slate-200 dark:border-slate-800 flex space-x-8">
          <button
            onClick={() => setActiveMainTab('partners')}
            className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
              activeMainTab === 'partners'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Đối Tác Cung Cấp Thực Phẩm</span>
            <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-xs font-bold">
              {partnerTotalElements}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('clients')}
            className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
              activeMainTab === 'clients'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <School className="h-4 w-4" />
            <span>Khách Hàng Hiện Tại (Trường Học, Văn Phòng)</span>
            <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 text-xs font-bold">
              {clientTotalElements}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('overview')}
            className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
              activeMainTab === 'overview'
                ? 'border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Quy Trình Khai Báo Ca Ăn (FEAT-01)</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ĐỐI TÁC CUNG CẤP THỰC PHẨM (RAW MATERIAL VENDORS) */}
        {/* ========================================================= */}
        {activeMainTab === 'partners' && (
          <div className="mt-6 space-y-5 animate-in fade-in">
            {/* Filter & Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedPartnerCategory('')}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition ${
                    selectedPartnerCategory === ''
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                  }`}
                >
                  Tất cả ({partnerTotalElements})
                </button>
                {PARTNER_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedPartnerCategory(cat.value)}
                    className={`inline-flex items-center space-x-1 rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition ${
                      selectedPartnerCategory === cat.value
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Search, Status & Add Button */}
              <div className="flex items-center space-x-2">
                <div className="relative min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={partnerSearch}
                    onChange={(e) => setPartnerSearch(e.target.value)}
                    placeholder="Tìm tên, đại diện, số HĐ..."
                    className="w-full rounded-xl border border-slate-200 py-1.5 pl-8 pr-3 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <select
                  value={selectedPartnerStatus}
                  onChange={(e) => setSelectedPartnerStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 py-1.5 px-2.5 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="ACTIVE">Đang hợp tác</option>
                  <option value="SUSPENDED">Tạm ngưng</option>
                  <option value="TERMINATED">Đã thanh lý</option>
                </select>

                <button
                  onClick={() => {
                    setEditingPartner(null);
                    setPartnerModalOpen(true);
                  }}
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition shrink-0"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Thêm đối tác</span>
                </button>
              </div>
            </div>

            {/* List / Table */}
            {loadingPartners ? (
              <div className="py-16 text-center">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-600" />
                <p className="mt-2 text-xs text-slate-500">Đang tải danh sách đối tác...</p>
              </div>
            ) : partners.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <Building2 className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                  Chưa có đối tác thực phẩm nào phù hợp
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Khai báo các đơn vị cung cấp Rau củ quả, Thịt cá, Đồ khô, Gia vị đạt chuẩn VSATTP
                </p>
                <button
                  onClick={() => {
                    setEditingPartner(null);
                    setPartnerModalOpen(true);
                  }}
                  className="mt-4 inline-flex items-center space-x-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500 transition"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Thêm đối tác thực phẩm đầu tiên</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-3.5 px-4">Tên Đối Tác</th>
                          <th className="py-3.5 px-4">Trạng Thái Hợp Đồng</th>
                          <th className="py-3.5 px-4">Người Phụ Trách</th>
                          <th className="py-3.5 px-4">Mã Hợp Đồng</th>
                          <th className="py-3.5 px-4 text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {partners.map((p) => {
                          const catMeta = PARTNER_CATEGORIES.find((c) => c.value === p.category) || PARTNER_CATEGORIES[0];
                          const statusMeta = PARTNER_STATUSES[p.status] || PARTNER_STATUSES.ACTIVE;

                          return (
                            <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                              {/* 1. Tên đối tác */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center space-x-2.5">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-sm shrink-0">
                                    {catMeta.icon}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                                      {p.name}
                                    </div>
                                    <span className="text-[10px] text-slate-400">
                                      {catMeta.label}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Trạng thái hợp đồng + icon đánh dấu sắp hết hạn */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusMeta.color}`}>
                                    {statusMeta.label}
                                  </span>

                                  {p.isExpiringSoon && (
                                    <span
                                      className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700 animate-pulse"
                                      title={`Hợp đồng sẽ hết hạn trong ${p.daysUntilExpiration} ngày`}
                                    >
                                      <AlertTriangle className="h-3 w-3 text-amber-600" />
                                      <span>Sắp hết hạn ({p.daysUntilExpiration} ngày)</span>
                                    </span>
                                  )}

                                  {p.daysUntilExpiration !== undefined && p.daysUntilExpiration < 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700">
                                      <AlertTriangle className="h-3 w-3 text-rose-600" />
                                      <span>Đã hết hạn</span>
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 3. Tên người phụ trách */}
                              <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                                {p.representative || '—'}
                              </td>

                              {/* 4. Mã hợp đồng */}
                              <td className="py-3.5 px-4">
                                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                                  {p.contractNumber || '—'}
                                </span>
                              </td>

                              {/* Thao tác (icon mắt xem chi tiết đầy đủ, icon sửa, icon xóa) */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="inline-flex items-center space-x-1">
                                  <button
                                    onClick={() => handleViewPartnerDetail(p.id)}
                                    title="Xem chi tiết đầy đủ"
                                    className="rounded-lg p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 transition"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditPartner(p.id)}
                                    title="Chỉnh sửa đối tác"
                                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeleteTarget({ type: 'partner', id: p.id, name: p.name });
                                      setDeleteConfirmOpen(true);
                                    }}
                                    title="Xóa đối tác"
                                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Phân trang 10-15 bản ghi / page */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-500">
                    Hiển thị trang <span className="font-bold text-slate-800 dark:text-slate-200">{partnerPage + 1}</span> / {partnerTotalPages > 0 ? partnerTotalPages : 1} (Tổng số: <span className="font-bold text-slate-800 dark:text-slate-200">{partnerTotalElements}</span> đối tác)
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => fetchPartners(partnerPage - 1)}
                      disabled={partnerPage <= 0 || loadingPartners}
                      className="inline-flex items-center space-x-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Trang trước</span>
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {partnerPage + 1}
                    </span>
                    <button
                      onClick={() => fetchPartners(partnerPage + 1)}
                      disabled={partnerPage >= partnerTotalPages - 1 || loadingPartners}
                      className="inline-flex items-center space-x-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      <span>Trang sau</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: KHÁCH HÀNG HIỆN TẠI (CLIENTS / INSTITUTIONS)       */}
        {/* ========================================================= */}
        {activeMainTab === 'clients' && (
          <div className="mt-6 space-y-5 animate-in fade-in">
            {/* Filter & Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* Type Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedClientType('')}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition ${
                    selectedClientType === ''
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                  }`}
                >
                  Tất cả ({clientTotalElements})
                </button>
                {CLIENT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setSelectedClientType(t.value)}
                    className={`inline-flex items-center space-x-1 rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition ${
                      selectedClientType === t.value
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Search, Status & Add Button */}
              <div className="flex items-center space-x-2">
                <div className="relative min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Tìm tên trường, đại diện, số HĐ..."
                    className="w-full rounded-xl border border-slate-200 py-1.5 pl-8 pr-3 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <select
                  value={selectedClientStatus}
                  onChange={(e) => setSelectedClientStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 py-1.5 px-2.5 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="ACTIVE">Đang thực hiện</option>
                  <option value="PAUSED">Tạm dừng</option>
                  <option value="EXPIRED">Đã kết thúc</option>
                </select>

                <button
                  onClick={() => {
                    setEditingClient(null);
                    setClientModalOpen(true);
                  }}
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition shrink-0"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Thêm khách hàng</span>
                </button>
              </div>
            </div>

            {/* List / Table */}
            {loadingClients ? (
              <div className="py-16 text-center">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
                <p className="mt-2 text-xs text-slate-500">Đang tải danh sách khách hàng...</p>
              </div>
            ) : clients.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <School className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                  Chưa có khách hàng nào phù hợp
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Thêm trường học, cơ sở mầm non hoặc doanh nghiệp ký hợp đồng cung ứng suất ăn bán trú
                </p>
                <button
                  onClick={() => {
                    setEditingClient(null);
                    setClientModalOpen(true);
                  }}
                  className="mt-4 inline-flex items-center space-x-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-500 transition"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Thêm khách hàng đầu tiên</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-3.5 px-4">Tên Khách Hàng</th>
                          <th className="py-3.5 px-4">Trạng Thái Hợp Đồng</th>
                          <th className="py-3.5 px-4">Người Phụ Trách</th>
                          <th className="py-3.5 px-4">Mã Hợp Đồng</th>
                          <th className="py-3.5 px-4 text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {clients.map((c) => {
                          const typeMeta = CLIENT_TYPES.find((t) => t.value === c.clientType) || CLIENT_TYPES[0];
                          const statusMeta = CLIENT_STATUSES[c.status] || CLIENT_STATUSES.ACTIVE;

                          return (
                            <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                              {/* 1. Tên khách hàng */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center space-x-2.5">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-sm shrink-0">
                                    {typeMeta.icon}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                                      {c.name}
                                    </div>
                                    <span className="text-[10px] text-slate-400">
                                      {typeMeta.label}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Trạng thái hợp đồng + icon đánh dấu sắp hết hạn */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusMeta.color}`}>
                                    {statusMeta.label}
                                  </span>

                                  {c.isExpiringSoon && (
                                    <span
                                      className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700 animate-pulse"
                                      title={`Hợp đồng sẽ hết hạn trong ${c.daysUntilExpiration} ngày`}
                                    >
                                      <AlertTriangle className="h-3 w-3 text-amber-600" />
                                      <span>Sắp hết hạn ({c.daysUntilExpiration} ngày)</span>
                                    </span>
                                  )}

                                  {c.daysUntilExpiration !== undefined && c.daysUntilExpiration < 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700">
                                      <AlertTriangle className="h-3 w-3 text-rose-600" />
                                      <span>Đã quá hạn</span>
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 3. Tên người phụ trách */}
                              <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                                {c.representativeName || '—'}
                              </td>

                              {/* 4. Mã hợp đồng */}
                              <td className="py-3.5 px-4">
                                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                                  {c.contractNumber || '—'}
                                </span>
                              </td>

                              {/* Thao tác (icon mắt xem chi tiết đầy đủ, icon sửa, icon xóa) */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="inline-flex items-center space-x-1">
                                  <button
                                    onClick={() => handleViewClientDetail(c.id)}
                                    title="Xem chi tiết đầy đủ"
                                    className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 transition"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditClient(c.id)}
                                    title="Chỉnh sửa khách hàng"
                                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeleteTarget({ type: 'client', id: c.id, name: c.name });
                                      setDeleteConfirmOpen(true);
                                    }}
                                    title="Xóa khách hàng"
                                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Phân trang 10-15 bản ghi / page */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-500">
                    Hiển thị trang <span className="font-bold text-slate-800 dark:text-slate-200">{clientPage + 1}</span> / {clientTotalPages > 0 ? clientTotalPages : 1} (Tổng số: <span className="font-bold text-slate-800 dark:text-slate-200">{clientTotalElements}</span> khách hàng)
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => fetchClients(clientPage - 1)}
                      disabled={clientPage <= 0 || loadingClients}
                      className="inline-flex items-center space-x-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Trang trước</span>
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {clientPage + 1}
                    </span>
                    <button
                      onClick={() => fetchClients(clientPage + 1)}
                      disabled={clientPage >= clientTotalPages - 1 || loadingClients}
                      className="inline-flex items-center space-x-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      <span>Trang sau</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: OVERVIEW & FEAT-01 LOGISTICS                       */}
        {/* ========================================================= */}
        {activeMainTab === 'overview' && (
          <div className="mt-6 space-y-6 animate-in fade-in">
            {/* Operating status card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-semibold text-slate-500">Trạng thái bếp hôm nay</span>
                <div className="mt-2 text-xl font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Đang vận hành</span>
                </div>
                <span className="text-[11px] text-slate-400">Chuẩn HACCP & ISO 22000</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-semibold text-slate-500">Tổng suất đăng ký</span>
                <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {summary && summary.totalDailyServings > 0
                    ? summary.totalDailyServings.toLocaleString('vi-VN')
                    : '1,650'} <span className="text-sm font-normal text-slate-500">suất</span>
                </div>
                <span className="text-[11px] text-slate-400">Giao đến {clients.length || 3} cơ sở trường học</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-semibold text-slate-500">Số xe vận chuyển</span>
                <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                  4 <span className="text-sm font-normal text-slate-500">xe thùng giữ nhiệt</span>
                </div>
                <span className="text-[11px] text-amber-600">Dự kiến xuất phát: 09:15</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-semibold text-slate-500">Hạn chót khai báo</span>
                <div className="mt-2 text-2xl font-extrabold text-amber-600">
                  09:00 <span className="text-sm font-normal text-slate-500">Sáng</span>
                </div>
                <span className="text-[11px] text-slate-400">Khóa cổng khai báo sau 09:00</span>
              </div>
            </div>

            {/* Feature notice */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
              <div className="flex items-start space-x-3">
                <Package className="h-6 w-6 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-amber-950 dark:text-amber-200">
                    Quy trình Nghiệp vụ FEAT-01: Khai Báo Ca Ăn & Logistics
                  </h3>
                  <p className="mt-1 text-xs text-amber-900/80 dark:text-amber-300">
                    Nhà cung cấp chịu trách nhiệm pháp lý nhập đầy đủ Bếp trưởng, Cán bộ QA, Biển số xe thùng giữ nhiệt, Tài xế, và danh mục nguyên liệu từ chuỗi đối tác đã khai báo.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="inline-flex items-center rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                      Bảo đảm nhiệt độ trên xe ≥ 65°C
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ==================== ALL MODALS ==================== */}

      {/* 1. Modal Thêm / Sửa Đối Tác Thực Phẩm */}
      <PartnerModal
        isOpen={partnerModalOpen}
        onClose={() => setPartnerModalOpen(false)}
        onSubmit={handleSavePartner}
        partner={editingPartner}
      />

      {/* 2. Modal Thêm / Sửa Khách Hàng */}
      <ClientModal
        isOpen={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
        onSubmit={handleSaveClient}
        client={editingClient}
      />

      {/* 3. Modal Xem Chi Tiết Đối Tác */}
      <PartnerDetailModal
        isOpen={partnerDetailOpen}
        onClose={() => setPartnerDetailOpen(false)}
        partner={viewingPartner}
        onEdit={(p) => {
          setPartnerDetailOpen(false);
          setEditingPartner(p);
          setPartnerModalOpen(true);
        }}
      />

      {/* 4. Modal Xem Chi Tiết Khách Hàng */}
      <ClientDetailModal
        isOpen={clientDetailOpen}
        onClose={() => setClientDetailOpen(false)}
        client={viewingClient}
        onEdit={(c) => {
          setClientDetailOpen(false);
          setEditingClient(c);
          setClientModalOpen(true);
        }}
        onViewPdf={(c) => {
          setPdfClient(c);
          setPdfModalOpen(true);
        }}
      />

      {/* 5. Modal Xem Bản Mềm PDF Hợp Đồng */}
      <ContractPdfModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        client={pdfClient}
        supplierName={user?.organization || 'CÔNG TY CP SUẤT ĂN HỌC ĐƯỜNG VINAMEAL'}
        supplierAddress={user?.address || 'Lô C2, KCN Tân Bình, Phường Tây Thạnh, Quận Tân Phú, TP. HCM'}
      />

      {/* 6. Modal Xác Nhận Xóa */}
      {deleteConfirmOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Xác Nhận Xóa {deleteTarget.type === 'partner' ? 'Đối Tác' : 'Khách Hàng'}
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              Bạn có chắc chắn muốn xóa &ldquo;<strong>{deleteTarget.name}</strong>&rdquo; khỏi danh sách? Thao tác này không thể hoàn tác.
            </p>
            <div className="mt-5 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-rose-500 disabled:opacity-50 transition"
              >
                {deleting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal Xin Cấp Tích Xanh */}
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
                  <p className="text-xs text-slate-500">Xác thực chứng nhận ATTP & uy tín cơ sở</p>
                </div>
              </div>
              <button
                onClick={() => setBadgeModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRequestBadgeSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lý do / Hồ sơ năng lực bếp ăn:
                </label>
                <textarea
                  rows={4}
                  required
                  value={badgeReason}
                  onChange={(e) => setBadgeReason(e.target.value)}
                  placeholder="Nhập thông tin chứng nhận VSATTP, số giấy phép, đơn vị trường học đang cung ứng..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
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
                  disabled={submittingBadge}
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submittingBadge ? 'Đang gửi...' : 'Gửi yêu cầu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
