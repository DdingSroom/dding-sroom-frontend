import type { ApiSchemas } from './api';

export type SignUpRequest = ApiSchemas['SignUpDTO'];
export type JoinRequest = ApiSchemas['JoinDTO'];
export type ModifyPasswordRequest = ApiSchemas['ModifyPasswordDTO'];
export type EmailVerificationRequest = ApiSchemas['EmailVerificationDTO'];
export type SendCodeRequest = ApiSchemas['CodeSendDTO'];
export type VerifyCodeRequest = ApiSchemas['CodeVerifyDTO'];
