'use client';

import React from 'react';
import { FoodPartner, PARTNER_STATUSES, PARTNER_CATEGORIES } from '@/types';
import { X, Building2, Phone, Mail, MapPin, Package, FileCheck, Calendar, ShieldCheck, ExternalLink } from 'lucide-react';

interface PartnerDetailModalProps {
  partner: FoodPartner | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (partner: FoodPartner) => void;
}

export const PartnerDetailModal: React.FC<PartnerDetailModalProps> = ({
  partner,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !partner) return null;

  const catMeta = PARTNER_CATEGORIES.find((c) => c.value === partner.category) || PARTNER_CATEGORIES[0];
  const statusMeta = PARTNER_STATUSES[partner.status] || PARTNER_STATUSES.ACTIVE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="text-xl">{catMeta.icon}</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Chi Tiết Đối Tác Cung Cấp Thực Phẩm
              </h3>
              <p className="text-xs text-slate-500">{partner.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {/* Header pill summary */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className={`inline-flex items-center space-x-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${catMeta.color}`}>
              <span>{catMeta.icon}</span>
              <span>{catMeta.label}</span>
            </span>

            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusMeta.color}`}>
              {statusMeta.label}
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block">Người đại diện:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {partner.representative || 'Chưa cập nhật'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Số điện thoại:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {partner.phone || 'Chưa cập nhật'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Email:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {partner.email || 'Chưa cập nhật'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Số hợp đồng:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {partner.contractNumber || 'Chưa cập nhật'}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-400 block">Địa chỉ cơ sở / nông trại:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 flex items-start gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{partner.address}</span>
              </span>
            </div>
          </div>

          {/* Supplied products */}
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 dark:border-emerald-950/60 dark:bg-emerald-950/20">
            <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 mb-1.5">
              <Package className="h-4 w-4 text-emerald-600" />
              <span>Danh mục sản phẩm khai báo cung cấp:</span>
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {partner.suppliedProducts}
            </p>
          </div>

          {/* Contract dates & certifications */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Thời hạn hợp đồng:
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {partner.contractStartDate ? new Date(partner.contractStartDate).toLocaleDateString('vi-VN') : '...'} -{' '}
                {partner.contractEndDate ? new Date(partner.contractEndDate).toLocaleDateString('vi-VN') : '...'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Giấy tờ đạt chuẩn ATTP & Chứng chỉ:</span>
              <div className="font-medium text-slate-800 dark:text-slate-200 flex items-start gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{partner.certifications || 'Chưa đính kèm chứng nhận'}</span>
              </div>
            </div>

            {partner.certificateFiles && (
              <div className="pt-1">
                <a
                  href={partner.certificateFiles}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Xem hồ sơ bản mềm chứng chỉ</span>
                </a>
              </div>
            )}
          </div>

          {/* Notes */}
          {partner.notes && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-400">
              <strong>Ghi chú:</strong> {partner.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(partner);
              }}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition"
            >
              Chỉnh sửa thông tin
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
