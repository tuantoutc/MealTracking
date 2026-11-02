import { ApiResponse, AuthResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

export function setTokens(accessToken: string, refreshToken: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_info');
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function rotateTokens(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    throw new Error('Refresh token expired or revoked');
  }

  const json: ApiResponse<AuthResponse> = await response.json();
  if (json.success && json.data) {
    setTokens(json.data.accessToken, json.data.refreshToken);
    return json.data.accessToken;
  }

  clearTokens();
  throw new Error('Failed to refresh tokens');
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  let token = getAccessToken();

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(url, { ...options, headers });

  // Token rotation interceptor on 401 Unauthorized
  if (response.status === 401 && !endpoint.includes('/api/v1/auth/')) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await rotateTokens();
        processQueue(null, newToken);
        headers.set('Authorization', `Bearer ${newToken}`);
        response = await fetch(url, { ...options, headers });
      } catch (err) {
        processQueue(err, null);
        window.location.href = '/login';
        throw err;
      } finally {
        isRefreshing = false;
      }
    } else {
      return new Promise<T>((resolve, reject) => {
        failedQueue.push({
          resolve: () => {
            const freshToken = getAccessToken();
            headers.set('Authorization', `Bearer ${freshToken}`);
            fetch(url, { ...options, headers })
              .then((res) => res.json())
              .then(resolve)
              .catch(reject);
          },
          reject,
        });
      });
    }
  }

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || `API error (${response.status})`);
  }

  return data.data;
}
