export type DishType =
  | 'COM'
  | 'CANH'
  | 'KHO'
  | 'XAO'
  | 'RAN'
  | 'TRANG_MIENG'
  | 'BUN'
  | 'MIEN'
  | 'PHO'
  | 'CHAO'
  | 'KHAC';

export interface DishTypeOption {
  value: DishType;
  label: string;
  defaultUnit: 'g' | 'ml';
  icon: string;
}

export const DISH_TYPES: DishTypeOption[] = [
  { value: 'COM', label: 'Cơm', defaultUnit: 'g', icon: '🍚' },
  { value: 'CANH', label: 'Món canh', defaultUnit: 'ml', icon: '🍲' },
  { value: 'KHO', label: 'Món kho', defaultUnit: 'g', icon: '🥘' },
  { value: 'XAO', label: 'Món xào', defaultUnit: 'g', icon: '🍳' },
  { value: 'RAN', label: 'Món rán', defaultUnit: 'g', icon: '🥓' },
  { value: 'TRANG_MIENG', label: 'Đồ tráng miệng', defaultUnit: 'g', icon: '🍨' },
  { value: 'BUN', label: 'Bún', defaultUnit: 'ml', icon: '🍜' },
  { value: 'MIEN', label: 'Miến', defaultUnit: 'ml', icon: '🥣' },
  { value: 'PHO', label: 'Phở', defaultUnit: 'ml', icon: '🍲' },
  { value: 'CHAO', label: 'Cháo', defaultUnit: 'ml', icon: '🥣' },
  { value: 'KHAC', label: 'Khác', defaultUnit: 'g', icon: '✨' },
];

export type RoleType =
  | 'ROLE_ADMIN'
  | 'ROLE_SUPPLIER'
  | 'ROLE_TEACHER'
  | 'ROLE_GATE_INSPECTOR'
  | 'ROLE_WARD_OFFICER'
  | 'ROLE_PRINCIPAL'
  | 'ROLE_PARENT'
  | 'ROLE_USER'
  | 'ROLE_NUTRITIONIST';

export const ROLE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  ROLE_ADMIN: { label: 'Quản trị viên', icon: '🛡️', color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800' },
  ROLE_SUPPLIER: { label: 'Nhà cung cấp', icon: '🏢', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
  ROLE_TEACHER: { label: 'Giáo viên', icon: '👩‍🏫', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
  ROLE_GATE_INSPECTOR: { label: 'Cán bộ kiểm duyệt', icon: '🔍', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800' },
  ROLE_WARD_OFFICER: { label: 'Cán bộ phường', icon: '🏛️', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800' },
  ROLE_PRINCIPAL: { label: 'Hiệu trưởng', icon: '🎓', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800' },
  ROLE_PARENT: { label: 'Phụ huynh', icon: '👨‍👩‍👧', color: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800' },
  ROLE_NUTRITIONIST: { label: 'Cán bộ dinh dưỡng', icon: '🥗', color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800' },
  ROLE_USER: { label: 'Người dùng', icon: '👤', color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  organization?: string;
  address?: string;
  avatarUrl?: string;
  provider?: string;
  requestedRole?: string;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  emailVerified?: boolean;
  verifiedBadge?: boolean;
  badgeRequested?: boolean;
  badgeRequestReason?: string;
  warningMessage?: string;
  warningCount?: number;
  locked?: boolean;
  enabled?: boolean;
  roles: string[];
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  user: User;
}

export interface AdminStats {
  totalUsers: number;
  pendingApprovals: number;
  approvedUsers: number;
  rejectedUsers: number;
  lockedUsers: number;
  verifiedBadgeCount: number;
  pendingBadgeRequests: number;
  roleDistribution: Record<string, number>;
}

export interface AccountWarning {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  adminFullName: string;
  warningTitle: string;
  warningContent: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Meal {
  id: number;
  title: string;
  dishType: DishType;
  customDishType?: string;
  dishTypeDisplay?: string;
  amount: number;
  unit: string;
  mealTime: string;
  notes?: string;
  createdAt: string;
}

export interface MealRequest {
  title: string;
  dishType: DishType;
  customDishType?: string;
  amount: number;
  unit: string;
  mealTime?: string;
  notes?: string;
}

export interface DailySummary {
  date: string;
  mealCount: number;
  totalGrams: number;
  totalMilliliters: number;
  countByType?: Record<string, number>;
  meals?: Meal[];
}

// ==================== SUPPLIER PARTNER & CLIENT TYPES ====================

export type PartnerCategory =
  | 'RAU_CU'
  | 'THIT_CA'
  | 'DO_KHO'
  | 'GIA_VI_NHU_YEU_PHAM'
  | 'KHAC';

export interface PartnerCategoryOption {
  value: PartnerCategory;
  label: string;
  icon: string;
  color: string;
}

export const PARTNER_CATEGORIES: PartnerCategoryOption[] = [
  { value: 'RAU_CU', label: 'Rau củ quả sạch', icon: '🥬', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' },
  { value: 'THIT_CA', label: 'Thịt tươi & Thủy hải sản', icon: '🥩', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300' },
  { value: 'DO_KHO', label: 'Gạo, đồ khô & Ngũ cốc', icon: '🌾', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' },
  { value: 'GIA_VI_NHU_YEU_PHAM', label: 'Gia vị & Nhu yếu phẩm', icon: '🧂', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300' },
  { value: 'KHAC', label: 'Nhóm thực phẩm khác', icon: '📦', color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300' },
];

export type PartnerStatus = 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';

export const PARTNER_STATUSES: Record<PartnerStatus, { label: string; color: string }> = {
  ACTIVE: { label: 'Đang hợp tác', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
  SUSPENDED: { label: 'Tạm ngưng', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
  TERMINATED: { label: 'Đã thanh lý', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' },
};

export interface FoodPartner {
  id: number;
  supplierId?: number;
  supplierName?: string;
  name: string;
  category: PartnerCategory;
  categoryDescription?: string;
  representative?: string;
  phone?: string;
  email?: string;
  address: string;
  suppliedProducts: string;
  contractNumber?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  certifications?: string;
  certificateFiles?: string;
  status: PartnerStatus;
  statusDescription?: string;
  notes?: string;
  isExpiringSoon?: boolean;
  daysUntilExpiration?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodPartnerSummary {
  id: number;
  name: string;
  category: PartnerCategory;
  categoryDescription?: string;
  representative?: string;
  contractNumber?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  status: PartnerStatus;
  statusDescription?: string;
  isExpiringSoon: boolean;
  daysUntilExpiration?: number;
}

export type ClientType =
  | 'TRUONG_MAM_NON'
  | 'TRUONG_TIEU_HOC'
  | 'TRUONG_THCS'
  | 'DOANH_NGHIEP'
  | 'KHAC';

export interface ClientTypeOption {
  value: ClientType;
  label: string;
  icon: string;
  color: string;
}

export const CLIENT_TYPES: ClientTypeOption[] = [
  { value: 'TRUONG_MAM_NON', label: 'Trường Mầm non', icon: '🧸', color: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300' },
  { value: 'TRUONG_TIEU_HOC', label: 'Trường Tiểu học', icon: '🏫', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300' },
  { value: 'TRUONG_THCS', label: 'Trường THCS / THPT', icon: '🎓', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300' },
  { value: 'DOANH_NGHIEP', label: 'Doanh nghiệp / Văn phòng', icon: '🏢', color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300' },
  { value: 'KHAC', label: 'Cơ sở khác', icon: '🏛️', color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300' },
];

export type ClientStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED';

export const CLIENT_STATUSES: Record<ClientStatus, { label: string; color: string }> = {
  ACTIVE: { label: 'Đang thực hiện', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
  PAUSED: { label: 'Tạm dừng', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
  EXPIRED: { label: 'Đã kết thúc', color: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300' },
};

export interface SupplierClient {
  id: number;
  supplierId?: number;
  supplierName?: string;
  name: string;
  clientType: ClientType;
  clientTypeDescription?: string;
  address: string;
  representativeName: string;
  representativeTitle?: string;
  phone: string;
  email?: string;
  contractNumber: string;
  dailyServings: number;
  pricePerServing: number;
  contractStartDate: string;
  contractEndDate: string;
  contractPdfUrl?: string;
  status: ClientStatus;
  statusDescription?: string;
  notes?: string;
  isExpiringSoon?: boolean;
  daysUntilExpiration?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierClientSummary {
  id: number;
  name: string;
  clientType: ClientType;
  clientTypeDescription?: string;
  representativeName: string;
  contractNumber: string;
  contractStartDate: string;
  contractEndDate: string;
  status: ClientStatus;
  statusDescription?: string;
  isExpiringSoon: boolean;
  daysUntilExpiration?: number;
}

export interface SupplierSummary {
  totalPartners: number;
  activePartners: number;
  totalClients: number;
  activeClients: number;
  totalDailyServings: number;
}
