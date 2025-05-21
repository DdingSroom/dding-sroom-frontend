import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 브라우저 환경에서만 sessionStorage 접근
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
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
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        window.location.href = '/login/step1';
      }
    }
    return Promise.reject(error);
  },
);

// accessToken을 sessionStorage에 저장하는 함수
export const setAccessToken = (token) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('accessToken', token);
  }
};

// accessToken을 sessionStorage에서 제거하는 함수
export const clearAccessToken = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('accessToken');
  }
};

export default axiosInstance;
