import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

// 토큰 갱신 상태 관리
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

const clearTokens = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userId');
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const nonAuthUrls = [
        '/login',
        '/user/sign-up',
        '/user/code-send',
        '/user/code-verify',
        '/reissue',
      ];

      config.headers = config.headers || {};

      const url = config.url || '';
      const isPublic = nonAuthUrls.some((u) => url.includes(u));

      if (isPublic) {
        delete config.headers.Authorization;
      } else {
        const accessToken = sessionStorage.getItem('accessToken');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          console.warn('No access token found for protected endpoint:', url);
          delete config.headers.Authorization;
        }
      }
    }
    return config;
  },
  (error) => {
    console.error('요청 오류:', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (typeof window === 'undefined') {
        return Promise.reject(error);
      }

      const refreshToken = sessionStorage.getItem('refreshToken');

      if (!refreshToken) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (!token) {
            return Promise.reject(error);
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/reissue`,
          null,
          { headers: { refresh: refreshToken } },
        );

        const newAccessToken =
          response.data?.accessToken ||
          response.headers['access'] ||
          response.headers['Access'];

        const newRefreshToken =
          response.data?.refreshToken ||
          response.headers['refresh'] ||
          response.headers['Refresh'];

        if (!newAccessToken) {
          throw new Error('토큰 재발급 응답에 accessToken이 없습니다.');
        }

        sessionStorage.setItem('accessToken', newAccessToken);

        if (newRefreshToken) {
          sessionStorage.setItem('refreshToken', newRefreshToken);
        }

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const setAccessToken = (token) => {
  if (typeof window !== 'undefined' && token) {
    sessionStorage.setItem('accessToken', token);
  }
};

export const clearAccessToken = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('accessToken');
  }
};

export default axiosInstance;
