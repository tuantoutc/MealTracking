'use client';

import React from 'react';
import { SupplierClient } from '@/types';
import { X, Download, Printer, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface ContractPdfModalProps {
  client: SupplierClient | null;
  isOpen: boolean;
  onClose: () => void;
  supplierName?: string;
  supplierAddress?: string;
}

export const ContractPdfModal: React.FC<ContractPdfModalProps> = ({
  client,
  isOpen,
  onClose,
  supplierName = 'CÔNG TY CP SUẤT ĂN HỌC ĐƯỜNG VINAMEAL',
  supplierAddress = 'Lô C2, KCN Tân Bình, Phường Tây Thạnh, Quận Tân Phú, TP. HCM',
}) => {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-800 text-white border-b border-slate-700 shrink-0">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-bold truncate">
              Bản mềm Hợp đồng: {client.contractNumber}
            </span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
              PDF Preview
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              title="In hợp đồng"
              className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              <Printer className="h-4 w-4" />
            </button>
            <a
              href={client.contractPdfUrl || '#'}
              target="_blank"
              rel="noreferrer"
              title="Tải về bản sao lưu"
              className="inline-flex items-center space-x-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Tải file</span>
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white transition ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Paper Contract Document */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-serif leading-relaxed text-xs sm:text-sm">
          {/* Header */}
          <div className="text-center border-b border-slate-300 dark:border-slate-800 pb-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </h4>
            <p className="font-semibold text-xs text-slate-600 dark:text-slate-400">
              Độc lập – Tự do – Hạnh phúc
            </p>
            <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-1 mb-4" />

            <h2 className="text-base sm:text-lg font-extrabold uppercase text-slate-900 dark:text-white font-sans mt-2">
              HỢP ĐỒNG CUNG CẤP SUẤT ĂN HỌC ĐƯỜNG & DINH DƯỠNG BÁN TRÚ
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Số: <strong>{client.contractNumber}</strong> / HĐ-MEALTRACE
            </p>
          </div>

          {/* Date */}
          <p className="italic text-slate-600 dark:text-slate-400 mt-4 text-center">
            Hôm nay, ngày {new Date(client.contractStartDate).toLocaleDateString('vi-VN')}, tại Văn phòng đại diện, chúng tôi gồm có:
          </p>

          {/* Parties */}
          <div className="mt-4 space-y-4 font-sans text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] text-emerald-700 dark:text-emerald-400">
                BÊN A: BÊN SỬ DỤNG DỊCH VỤ (KHÁCH HÀNG / TRƯỜNG HỌC)
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div><strong>Đơn vị:</strong> {client.name}</div>
                <div><strong>Loại hình:</strong> {client.clientTypeDescription || client.clientType}</div>
                <div><strong>Địa chỉ giao nhận:</strong> {client.address}</div>
                <div><strong>Đại diện:</strong> {client.representativeName} ({client.representativeTitle || 'Đại diện hợp pháp'})</div>
                <div><strong>Điện thoại:</strong> {client.phone}</div>
                <div><strong>Email:</strong> {client.email || 'Chưa cung cấp'}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] text-blue-700 dark:text-blue-400">
                BÊN B: BÊN CUNG CẤP SUẤT ĂN (BẾP TRUNG TÂM / NHÀ CUNG CẤP)
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div><strong>Đơn vị:</strong> {supplierName}</div>
                <div><strong>Địa chỉ bếp:</strong> {supplierAddress}</div>
                <div><strong>Chứng nhận chất lượng:</strong> Chuẩn HACCP, ISO 22000:2018, Đủ điều kiện VSATTP</div>
                <div><strong>Nền tảng kiểm định:</strong> Hệ thống Giám sát Chuỗi cung ứng MealTrace</div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-6 space-y-3 font-sans text-xs text-slate-700 dark:text-slate-300">
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">ĐIỀU KHOẢN HỢP ĐỒNG:</h5>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Quy mô cung ứng:</strong> Bên B cam kết phục vụ trung bình <strong>{client.dailyServings.toLocaleString('vi-VN')} suất ăn/ngày</strong>, thực đơn đa dạng được thông báo trước 07 ngày làm việc.
              </li>
              <li>
                <strong>Đơn giá thanh toán:</strong> Đơn giá thỏa thuận là <strong>{client.pricePerServing.toLocaleString('vi-VN')} VNĐ/suất</strong> (Đã bao gồm chi phí vận chuyển xe thùng giữ nhiệt và bảo hiểm ATTP).
              </li>
              <li>
                <strong>Thời hạn thực hiện hợp đồng:</strong> Có hiệu lực từ ngày <strong>{new Date(client.contractStartDate).toLocaleDateString('vi-VN')}</strong> đến hết ngày <strong>{new Date(client.contractEndDate).toLocaleDateString('vi-VN')}</strong>.
              </li>
              <li>
                <strong>Kiểm tra an toàn thực phẩm & nhiệt độ bàn giao:</strong> Nhiệt độ món ăn tại cổng trường phải đạt ≥ 65°C. Bên B có trách nhiệm lưu mẫu thức ăn 24 giờ theo quy chuẩn Bộ Y tế.
              </li>
              <li>
                <strong>Số hóa giám sát:</strong> Toàn bộ dữ liệu nguồn gốc nguyên liệu, nhiệt độ xe giao và ảnh đối chiếu suất ăn thực tế được công khai trên nền tảng MealTrace.
              </li>
            </ol>
          </div>

          {/* Signature Block */}
          <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-800 grid grid-cols-2 text-center font-sans">
            <div>
              <p className="font-bold text-slate-900 dark:text-white uppercase text-xs">ĐẠI DIỆN BÊN A</p>
              <p className="text-[11px] text-slate-500 mt-1">{client.representativeTitle || 'Đại diện'}</p>
              <div className="h-16 flex items-center justify-center">
                <span className="font-serif italic text-blue-600 text-sm">{client.representativeName}</span>
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{client.representativeName}</p>
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-white uppercase text-xs">ĐẠI DIỆN BÊN B</p>
              <p className="text-[11px] text-slate-500 mt-1">Giám đốc Điều hành Bếp</p>
              <div className="h-16 flex items-center justify-center relative">
                {/* Stamp visual */}
                <div className="rounded-full border-2 border-rose-500/80 px-3 py-1 rotate-[-12deg] text-rose-600 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  ✓ ĐÃ KÝ ĐIỆN TỬ
                </div>
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">Đại diện Bếp Trung Tâm</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
          <span className="text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Hợp đồng đã được xác thực mã hóa lưu trữ trên hệ thống MealTrace
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
