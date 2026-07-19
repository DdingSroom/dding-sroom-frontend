'use client';

import useAuthReady from './useAuthReady';

export default function useRequireAuth() {
  const { authReady, accessToken, userId, role } = useAuthReady();

  const isAuthenticated = Boolean(accessToken);
  const requireLogin = authReady && !isAuthenticated;

  const redirectToLogin = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  return {
    authReady,
    isAuthenticated,
    requireLogin,
    accessToken,
    userId,
    role,
    redirectToLogin,
  };
}
