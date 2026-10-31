import { USER_API_ENDPOINTS } from '@api/endpoints';
import { api } from '@shared/api/api';

import type { ApiSchemas } from '../types/api';

type ResponseDTO = ApiSchemas['ResponseDTO'];
type ChangeUsernameDTO = ApiSchemas['ChangeUsernameDTO'];
type EmailVerificationDTO = ApiSchemas['EmailVerificationDTO'];

// 인증 토큰으로 사용자 식별 (userId 미전달)
export const changeUsername = (newUsername: string): Promise<ResponseDTO> =>
  api.put<ResponseDTO, ChangeUsernameDTO>(USER_API_ENDPOINTS.CHANGE_USERNAME, {
    newUsername,
  });

export const verifyEmail = (email: string): Promise<ResponseDTO> =>
  api.post<ResponseDTO, EmailVerificationDTO>(USER_API_ENDPOINTS.VERIFY_EMAIL, {
    email,
  });

// 인증 토큰으로 사용자 식별 (userId 미전달)
export const withdrawUser = (): Promise<ResponseDTO> =>
  api.delete<ResponseDTO>(USER_API_ENDPOINTS.WITHDRAW);
