export function getRoleDashboardPath(roles?: string[]): string {
  if (!roles || roles.length === 0) return '/';
  if (roles.includes('ROLE_ADMIN')) return '/admin';
  if (roles.includes('ROLE_SUPPLIER')) return '/supplier';
  if (roles.includes('ROLE_GATE_INSPECTOR')) return '/inspector';
  if (roles.includes('ROLE_TEACHER')) return '/teacher';
  if (roles.includes('ROLE_WARD_OFFICER')) return '/ward';
  if (roles.includes('ROLE_PRINCIPAL')) return '/principal';
  if (roles.includes('ROLE_PARENT')) return '/parent';
  return '/';
}
