import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const nonAuthUrls = [
        '/login',
        '/user/sign-up',
        '/user/code-send',
        '/user/code-verify',
      ];

      // 인증이 필요 없는 요청이면 Authorization 제거
      const isPublic = nonAuthUrls.some((url) => config.url?.includes(url));
      if (isPublic) {
        delete config.headers.Authorization;
      } else {
        const accessToken = sessionStorage.getItem('accessToken');
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
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
  (error) => {
    const { response } = error;
    if (response && (response.status === 401 || response.status === 403)) {
      if (typeof window !== 'undefined') {
        // 로그인이 필요한 경우 토큰 제거
        sessionStorage.removeItem('accessToken');
      }
    }
    return Promise.reject(error);
  },
);

export const setAccessToken = (token) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('accessToken', token);
  }
};

export const clearAccessToken = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('accessToken');
  }
};

export default axiosInstance;
