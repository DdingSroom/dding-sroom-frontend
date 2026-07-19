import { api } from '@shared/api/api';
import instance, { requestReissue } from '@shared/api/instance';

export interface AuthTokens {
  accessToken: string | null;
}

export interface SignupPayload {
  email: string;
  password: string;
  username: string;
  age?: string;
  studentNumber?: string;
}

const extractAuthTokens = (
  headers: Record<string, string | undefined>,
): AuthTokens => {
  const accessToken =
    headers['access'] ||
    headers['Access'] ||
    headers['authorization'] ||
    headers['Authorization'] ||
    null;

  return { accessToken };
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthTokens> => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  const response = await instance.post('/login', formData);
  return extractAuthTokens(
    response.headers as Record<string, string | undefined>,
  );
};

export const adminLogin = login;

export const logout = async (): Promise<void> => {
  await api.post<void>('/logout');
};

export const signup = async (payload: SignupPayload): Promise<void> => {
  await api.post<void>('/user/sign-up', payload);
};

export const sendVerificationCode = async (email: string): Promise<void> => {
  await api.post<void>('/user/code-send', { email });
};

interface VerifyCodeResponseData {
  verified?: boolean;
  success?: boolean;
}

export const verifyCode = async (
  email: string,
  code: string,
): Promise<boolean> => {
  const response = await instance.post<VerifyCodeResponseData>(
    '/user/code-verify',
    { email, code },
  );

  return (
    (response.data?.verified ?? response.data?.success) === true ||
    response.status === 200
  );
};

export const resetPassword = async (
  email: string,
  password: string,
): Promise<void> => {
  await api.post<void>('/user/modify-password', { email, password });
};

export const reissue = requestReissue;
