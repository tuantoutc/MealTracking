'use client';

import React from 'react';
import { SupplierClient, CLIENT_STATUSES, CLIENT_TYPES } from '@/types';
import { X, School, Phone, Mail, MapPin, FileText, UserCheck, Calendar, DollarSign, Download, Eye } from 'lucide-react';

interface ClientDetailModalProps {
  client: SupplierClient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (client: SupplierClient) => void;
  onViewPdf?: (client: SupplierClient) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  isOpen,
  onClose,
  onEdit,
  onViewPdf,
}) => {
  if (!isOpen || !client) return null;

  const typeMeta = CLIENT_TYPES.find((t) => t.value === client.clientType) || CLIENT_TYPES[0];
  const statusMeta = CLIENT_STATUSES[client.status] || CLIENT_STATUSES.ACTIVE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              <span className="text-xl">{typeMeta.icon}</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hồ Sơ Khách Hàng Suất Ăn
              </h3>
              <p className="text-xs text-slate-500">{client.name}</p>
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
          {/* Status pill summary */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className={`inline-flex items-center space-x-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeMeta.color}`}>
              <span>{typeMeta.icon}</span>
              <span>{typeMeta.label}</span>
            </span>

            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusMeta.color}`}>
              {statusMeta.label}
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block">Người đại diện làm việc:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {client.representativeName}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {client.representativeTitle || 'Đại diện hợp pháp'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Số điện thoại liên hệ:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {client.phone}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Email đơn vị:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {client.email || 'Chưa cung cấp'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Mã số hợp đồng:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {client.contractNumber}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-400 block">Địa chỉ giao nhận suất ăn:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 flex items-start gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{client.address}</span>
              </span>
            </div>
          </div>

          {/* Quy mô & Đơn giá card */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 dark:border-blue-950/60 dark:bg-blue-950/20">
            <div>
              <span className="text-[11px] font-semibold text-blue-900/70 dark:text-blue-300 block">
                Số lượng suất phục vụ / ngày:
              </span>
              <div className="text-xl font-extrabold text-blue-950 dark:text-blue-100 mt-1">
                {client.dailyServings.toLocaleString('vi-VN')}{' '}
                <span className="text-xs font-normal text-slate-500">suất/ngày</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-blue-900/70 dark:text-blue-300 block">
                Đơn giá hợp đồng:
              </span>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {client.pricePerServing.toLocaleString('vi-VN')}{' '}
                <span className="text-xs font-normal text-slate-500">đ/suất</span>
              </div>
            </div>
          </div>

          {/* Contract dates & Soft PDF */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Thời hạn hợp đồng:
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {new Date(client.contractStartDate).toLocaleDateString('vi-VN')} -{' '}
                {new Date(client.contractEndDate).toLocaleDateString('vi-VN')}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                Bản mềm PDF hợp đồng:
              </span>

              {onViewPdf && (
                <button
                  onClick={() => {
                    onClose();
                    onViewPdf(client);
                  }}
                  className="inline-flex items-center space-x-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Xem bản mềm PDF</span>
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-400">
              <strong>Yêu cầu vận hành / bàn giao:</strong> {client.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(client);
              }}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition"
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
