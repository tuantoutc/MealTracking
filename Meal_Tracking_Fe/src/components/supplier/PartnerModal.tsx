'use client';

import React, { useState, useEffect } from 'react';
import { FoodPartner, PartnerCategory, PartnerStatus, PARTNER_CATEGORIES, PARTNER_STATUSES } from '@/types';
import { X, Save, Building2, Phone, Mail, MapPin, Package, FileCheck, Calendar } from 'lucide-react';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<FoodPartner>) => Promise<void>;
  partner?: FoodPartner | null;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  partner,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PartnerCategory>('RAU_CU');
  const [representative, setRepresentative] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [suppliedProducts, setSuppliedProducts] = useState('');
  const [contractNumber, setContractNumber] = useState('');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [certifications, setCertifications] = useState('');
  const [certificateFiles, setCertificateFiles] = useState('');
  const [status, setStatus] = useState<PartnerStatus>('ACTIVE');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (partner) {
      setName(partner.name || '');
      setCategory(partner.category || 'RAU_CU');
      setRepresentative(partner.representative || '');
      setPhone(partner.phone || '');
      setEmail(partner.email || '');
      setAddress(partner.address || '');
      setSuppliedProducts(partner.suppliedProducts || '');
      setContractNumber(partner.contractNumber || '');
      setContractStartDate(partner.contractStartDate || '');
      setContractEndDate(partner.contractEndDate || '');
      setCertifications(partner.certifications || '');
      setCertificateFiles(partner.certificateFiles || '');
      setStatus(partner.status || 'ACTIVE');
      setNotes(partner.notes || '');
    } else {
      setName('');
      setCategory('RAU_CU');
      setRepresentative('');
      setPhone('');
      setEmail('');
      setAddress('');
      setSuppliedProducts('');
      setContractNumber(`HĐ-${new Date().getFullYear()}/` + Math.floor(1000 + Math.random() * 9000));
      setContractStartDate(new Date().toISOString().split('T')[0]);
      // default end date 1 year later
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setContractEndDate(nextYear.toISOString().split('T')[0]);
      setCertifications('Chứng nhận VietGAP / Đạt chuẩn cơ sở đủ điều kiện VSATTP');
      setCertificateFiles('');
      setStatus('ACTIVE');
      setNotes('');
    }
  }, [partner, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        name,
        category,
        representative,
        phone,
        email,
        address,
        suppliedProducts,
        contractNumber,
        contractStartDate,
        contractEndDate,
        certifications,
        certificateFiles,
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {partner ? 'Cập Nhật Đối Tác Cung Cấp Thực Phẩm' : 'Thêm Đối Tác Cung Cấp Thực Phẩm Mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Khai báo danh mục nguyên liệu, giấy tờ ATTP & hợp đồng cung ứng
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
          {/* Tên & Phân loại */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tên đối tác / HTX / Công ty <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: HTX Nông Sản Sạch Đà Lạt GreenFarm"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phân loại thực phẩm <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PartnerCategory)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {PARTNER_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Người đại diện, SĐT, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Người đại diện / Phụ trách
              </label>
              <input
                type="text"
                value={representative}
                onChange={(e) => setRepresentative(e.target.value)}
                placeholder="Họ và tên người đại diện"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số điện thoại liên hệ
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@doitac.com"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Địa chỉ cơ sở */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Địa chỉ cơ sở / nông trại / xưởng sản xuất <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Thôn/Xã/Phường, Huyện/Quận, Tỉnh/TP nơi trồng trọt hoặc chế biến..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Sản phẩm khai báo cung cấp */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Danh mục các sản phẩm cung cấp <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={suppliedProducts}
              onChange={(e) => setSuppliedProducts(e.target.value)}
              placeholder="Ví dụ: Bắp cải tím, Cà chua bi, Su su, Cải ngọt baby, Cà rốt Đà Lạt..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Hợp đồng: Số HĐ, Ngày bắt đầu, Ngày kết thúc */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số / Mã hợp đồng
              </label>
              <input
                type="text"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                placeholder="HĐ-2026/..."
                className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ngày bắt đầu hợp đồng
              </label>
              <input
                type="date"
                value={contractStartDate}
                onChange={(e) => setContractStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Thời hạn / Ngày hết hạn
              </label>
              <input
                type="date"
                value={contractEndDate}
                onChange={(e) => setContractEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Giấy tờ đạt chuẩn & File link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Giấy tờ đạt chuẩn ATTP / Chứng chỉ
              </label>
              <input
                type="text"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                placeholder="VietGAP số ..., Chuẩn HACCP, Giấy chứng nhận ATTP..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Đường dẫn / File bản mềm chứng chỉ
              </label>
              <input
                type="text"
                value={certificateFiles}
                onChange={(e) => setCertificateFiles(e.target.value)}
                placeholder="https://... hoặc tên tệp đính kèm chứng nhận"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Trạng thái & Ghi chú */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Trạng thái hợp tác
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PartnerStatus)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="ACTIVE">Đang hợp tác</option>
                <option value="SUSPENDED">Tạm ngưng</option>
                <option value="TERMINATED">Đã thanh lý</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ghi chú điều kiện giao nhận / Kiểm dịch
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Giao xe lạnh lúc 04:30 sáng, có hóa đơn VAT..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
              className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500 disabled:opacity-50 transition"
            >
              <Save className="h-4 w-4" />
              <span>{submitting ? 'Đang lưu...' : partner ? 'Lưu cập nhật' : 'Thêm đối tác'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
