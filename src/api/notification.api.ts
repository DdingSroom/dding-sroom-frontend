import { api } from '@shared/api/api';
import { NOTIFICATION_API_ENDPOINTS } from '@shared/api/endpoints';

import type { ApiSchemas } from '../types/api';

export type NotificationUpdateRequest =
  ApiSchemas['NotificationUpdateRequestDTO'];

export type NotificationViewCountRequest =
  ApiSchemas['NotificationViewCountRequestDTO'];

export type NotificationReadRequest = ApiSchemas['NotificationReadRequestDTO'];

export type NotificationCreateRequest =
  ApiSchemas['NotificationCreateRequestDTO'];

type NotificationResponse =
  ApiSchemas['BaseResponseDTONotificationResponseDTO'];

type NotificationListResponse =
  ApiSchemas['BaseResponseDTOListNotificationResponseDTO'];

type NotificationCountResponse = ApiSchemas['BaseResponseDTOLong'];

type NotificationReadResponse =
  ApiSchemas['BaseResponseDTONotificationReadResponseDTO'];

type NotificationMutationResponse = ApiSchemas['BaseResponseDTOVoid'];

// 공지사항 수정
export const updateNotification = (data: NotificationUpdateRequest) =>
  api.put<NotificationResponse, NotificationUpdateRequest>(
    NOTIFICATION_API_ENDPOINTS.UPDATE,
    data,
  );

// 공지사항 조회수 증가
export const incrementNotificationViewCount = (
  data: NotificationViewCountRequest,
) =>
  api.post<NotificationMutationResponse, NotificationViewCountRequest>(
    NOTIFICATION_API_ENDPOINTS.VIEW,
    data,
  );

// 공지 읽음 처리
export const markNotificationAsRead = (data: NotificationReadRequest) =>
  api.post<NotificationReadResponse, NotificationReadRequest>(
    NOTIFICATION_API_ENDPOINTS.READ,
    data,
  );

// 공지사항 생성
export const createNotification = (data: NotificationCreateRequest) =>
  api.post<NotificationResponse, NotificationCreateRequest>(
    NOTIFICATION_API_ENDPOINTS.CREATE,
    data,
  );

// 특정 공지사항 상세 조회
export const getNotification = (id: number) =>
  api.get<NotificationResponse>(NOTIFICATION_API_ENDPOINTS.BY_ID(id));

// 최근 공지사항 개수 조회
export const getRecentNotificationsCount = () =>
  api.get<NotificationCountResponse>(NOTIFICATION_API_ENDPOINTS.RECENT_COUNT);

// 전체 공지사항 조회
export const getNotifications = () =>
  api.get<NotificationListResponse>(NOTIFICATION_API_ENDPOINTS.LIST);

// 공지사항 삭제
export const deleteNotification = (id: number) =>
  api.delete<NotificationMutationResponse>(
    NOTIFICATION_API_ENDPOINTS.DELETE(id),
  );
