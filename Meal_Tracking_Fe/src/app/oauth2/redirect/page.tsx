'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { setTokens, apiClient } from '@/lib/api';
import { User } from '@/types';
import { getRoleDashboardPath } from '@/lib/roleNavigation';

function OAuth2RedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithTokens } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);

      // Fetch user profile
      apiClient<User>('/api/v1/auth/me')
        .then((user) => {
          loginWithTokens({
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            expiresInMs: 432000000,
            user,
          });
          router.replace(getRoleDashboardPath(user.roles));
        })
        .catch((err) => {
          console.error('Failed to get user profile from OAuth2:', err);
          router.replace('/login?error=oauth_profile_failed');
        });
    } else {
      router.replace('/login?error=oauth_missing_tokens');
    }
  }, [router, searchParams, loginWithTokens]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
        Đang xử lý đăng nhập OAuth2...
      </p>
    </div>
  );
}

export default function OAuth2RedirectPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    }>
      <OAuth2RedirectHandler />
    </Suspense>
  );
}
