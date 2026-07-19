import * as Sentry from '@sentry/nextjs';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import useTokenStore from '@stores/useTokenStore';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export interface ReissuedTokens {
  accessToken: string;
}

interface ReissueResponseData {
  accessToken?: string;
}

const PUBLIC_URLS = [
  '/login',
  '/user/sign-up',
  '/user/code-send',
  '/user/code-verify',
  '/reissue',
];

const isPublicUrl = (url: string) =>
  PUBLIC_URLS.some((publicUrl) => url.includes(publicUrl));

const normalizePathParams = (path: string) =>
  path.replace(/\/\d+(?=\/|$)/g, '/{id}');

const instance = axios.create({
  baseURL: '/backend',
  timeout: 10000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

export const requestReissue = async (): Promise<ReissuedTokens> => {
  const response = await axios.post<ReissueResponseData>(
    '/backend/reissue',
    null,
    { withCredentials: true },
  );

  const accessToken =
    response.data?.accessToken ||
    (response.headers['access'] as string | undefined) ||
    (response.headers['Access'] as string | undefined);

  if (!accessToken) {
    throw new Error('토큰 재발급 응답에 accessToken이 없습니다.');
  }

  return { accessToken };
};

instance.interceptors.request.use(
  (config) => {
    const url = config.url || '';

    if (isPublicUrl(url)) {
      config.headers.delete('Authorization');
      return config;
    }

    const { accessToken } = useTokenStore.getState();
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    } else {
      console.warn('No access token found for protected endpoint:', url);
      config.headers.delete('Authorization');
    }

    return config;
  },
  (error) => {
    console.error('요청 오류:', error);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    const requestUrl = originalRequest?.url || '';

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest &&
      !originalRequest._retry &&
      !isPublicUrl(requestUrl)
    ) {
      const { setAccessToken, clearTokens } = useTokenStore.getState();

      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (!token) {
            return Promise.reject(error);
          }
          originalRequest.headers.set('Authorization', `Bearer ${token}`);
          return instance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { accessToken } = await requestReissue();

        setAccessToken(accessToken);
        processQueue(null, accessToken);

        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response && error.config?.url) {
      try {
        const fullUrl = new URL(error.config.url, error.config.baseURL);
        const normalizedPath = normalizePathParams(fullUrl.pathname);
        error.name = `[${error.response.status} Error] - ${fullUrl.origin}${normalizedPath}`;

        Sentry.captureException(error, {
          fingerprint: [String(error.response.status), normalizedPath],
        });
        (error as { __sentry_captured__?: boolean }).__sentry_captured__ = true;
      } catch {}
    }

    return Promise.reject(error);
  },
);

export default instance;
