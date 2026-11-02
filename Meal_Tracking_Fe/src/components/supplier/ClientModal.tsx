'use client';

import React, { useState, useEffect } from 'react';
import { SupplierClient, ClientType, ClientStatus, CLIENT_TYPES, CLIENT_STATUSES } from '@/types';
import { X, Save, School, Phone, Mail, MapPin, FileText, UserCheck, DollarSign, Calendar } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<SupplierClient>) => Promise<void>;
  client?: SupplierClient | null;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  client,
}) => {
  const [name, setName] = useState('');
  const [clientType, setClientType] = useState<ClientType>('TRUONG_TIEU_HOC');
  const [address, setAddress] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [representativeTitle, setRepresentativeTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contractNumber, setContractNumber] = useState('');
  const [dailyServings, setDailyServings] = useState<string>('500');
  const [pricePerServing, setPricePerServing] = useState<string>('35000');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [contractPdfUrl, setContractPdfUrl] = useState('');
  const [status, setStatus] = useState<ClientStatus>('ACTIVE');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name || '');
      setClientType(client.clientType || 'TRUONG_TIEU_HOC');
      setAddress(client.address || '');
      setRepresentativeName(client.representativeName || '');
      setRepresentativeTitle(client.representativeTitle || '');
      setPhone(client.phone || '');
      setEmail(client.email || '');
      setContractNumber(client.contractNumber || '');
      setDailyServings(client.dailyServings !== undefined && client.dailyServings !== null ? String(client.dailyServings) : '');
      setPricePerServing(client.pricePerServing !== undefined && client.pricePerServing !== null ? String(client.pricePerServing) : '');
      setContractStartDate(client.contractStartDate || '');
      setContractEndDate(client.contractEndDate || '');
      setContractPdfUrl(client.contractPdfUrl || '');
      setStatus(client.status || 'ACTIVE');
      setNotes(client.notes || '');
    } else {
      setName('');
      setClientType('TRUONG_TIEU_HOC');
      setAddress('');
      setRepresentativeName('');
      setRepresentativeTitle('Hiệu Trưởng / Phụ Trách Bán Trú');
      setPhone('');
      setEmail('');
      setContractNumber(`HĐCƯ-${new Date().getFullYear()}/` + Math.floor(100 + Math.random() * 900));
      setDailyServings('500');
      setPricePerServing('35000');
      setContractStartDate(new Date().toISOString().split('T')[0]);
      // default 1 academic year or 1 year
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setContractEndDate(nextYear.toISOString().split('T')[0]);
      setContractPdfUrl('https://storage.mealtrace.vn/contracts/hopdong-cungcap.pdf');
      setStatus('ACTIVE');
      setNotes('Giao trước 09:30 sáng. Kiểm nhiệt độ tại cổng ≥ 65°C.');
    }
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleNumberChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setter('');
      return;
    }
    if (/^\d*$/.test(val)) {
      const sanitized = val.replace(/^0+(?=\d)/, '');
      setter(sanitized);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        name,
        clientType,
        address,
        representativeName,
        representativeTitle,
        phone,
        email,
        contractNumber,
        dailyServings: parseInt(dailyServings, 10) || 0,
        pricePerServing: parseFloat(pricePerServing) || 0,
        contractStartDate,
        contractEndDate,
        contractPdfUrl,
        status,
        notes,
      });
      onClose();
    } catch {
      // error handled by parent with toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              <School className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {client ? 'Cập Nhật Thông Tin Khách Hàng' : 'Thêm Khách Hàng Sử Dụng Suất Ăn Mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Nhà trường, cơ sở giáo dục, doanh nghiệp ký hợp đồng cung ứng suất ăn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Tên khách hàng & Loại hình */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tên trường học / Doanh nghiệp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Trường Tiểu Học Chu Văn An"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Loại hình khách hàng <span className="text-rose-500">*</span>
              </label>
              <select
                value={clientType}
                onChange={(e) => setClientType(e.target.value as ClientType)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {CLIENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Địa chỉ giao nhận suất ăn */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Địa chỉ nhận hàng / Cơ sở trường học <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện điểm giao suất ăn..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Đại diện: Họ tên, Chức vụ, SĐT, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Người đại diện <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={representativeName}
                onChange={(e) => setRepresentativeName(e.target.value)}
                placeholder="Thầy/Cô/Anh/Chị..."
                className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chức vụ
              </label>
              <input
                type="text"
                value={representativeTitle}
                onChange={(e) => setRepresentativeTitle(e.target.value)}
                placeholder="Hiệu trưởng / Trưởng ban..."
                className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số điện thoại <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email liên hệ
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@truonghoc.edu.vn"
                className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Hợp đồng: Số HĐ, Suất/ngày, Đơn giá/suất */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mã / Số hợp đồng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                placeholder="HĐCƯ-2026/..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số suất cam kết / ngày <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={dailyServings}
                onChange={handleNumberChange(setDailyServings)}
                placeholder="Ví dụ: 750"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Đơn giá mỗi suất (VNĐ) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={pricePerServing}
                onChange={handleNumberChange(setPricePerServing)}
                placeholder="Ví dụ: 35000"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Ngày bắt đầu, Ngày kết thúc, Trạng thái */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ngày bắt đầu HĐ <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={contractStartDate}
                onChange={(e) => setContractStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ngày kết thúc HĐ <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={contractEndDate}
                onChange={(e) => setContractEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Trạng thái hợp tác
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ClientStatus)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="ACTIVE">Đang thực hiện</option>
                <option value="PAUSED">Tạm dừng</option>
                <option value="EXPIRED">Đã kết thúc</option>
              </select>
            </div>
          </div>

          {/* Link bản mềm PDF & Ghi chú */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bản mềm PDF hợp đồng (Link URL)
              </label>
              <input
                type="text"
                value={contractPdfUrl}
                onChange={(e) => setContractPdfUrl(e.target.value)}
                placeholder="https://... hoặc tên tệp pdf lưu trữ"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ghi chú yêu cầu giao nhận
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Kiểm tra nhiệt độ cổng ≥ 65°C, thực đơn ít cay..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition"
            >
              <Save className="h-4 w-4" />
              <span>{submitting ? 'Đang lưu...' : client ? 'Lưu cập nhật' : 'Thêm khách hàng'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
