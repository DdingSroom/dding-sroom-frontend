import { api } from '@shared/api/api';

import type { ApiSchemas } from '../types/api';

export type NotificationUpdateRequest =
  ApiSchemas['NotificationUpdateRequestDTO'];
export type NotificationViewCountRequest =
  ApiSchemas['NotificationViewCountRequestDTO'];
export type NotificationCreateRequest =
  ApiSchemas['NotificationCreateRequestDTO'];

type NotificationResponse = ApiSchemas['BaseResponseDTO'];

// 공지사항 수정
export const updateNotification = (data: NotificationUpdateRequest) =>
  api.put<NotificationResponse, NotificationUpdateRequest>(
    '/api/notification/update',
    data,
  );

// 공지사항 조회수 증가
export const incrementNotificationViewCount = (
  data: NotificationViewCountRequest,
) =>
  api.post<NotificationResponse, NotificationViewCountRequest>(
    '/api/notification/view',
    data,
  );

// 공지사항 생성
export const createNotification = (data: NotificationCreateRequest) =>
  api.post<NotificationResponse, NotificationCreateRequest>(
    '/api/notification/create',
    data,
  );

// 특정 공지사항 상세 조회
export const getNotification = (id: number) =>
  api.get<NotificationResponse>(`/api/notification/${id}`);

// 최근 공지사항 개수 조회
export const getRecentNotificationsCount = () =>
  api.get<NotificationResponse>('/api/notification/recent-count');

// 전체 공지사항 조회
export const getNotifications = () =>
  api.get<NotificationResponse>('/api/notification/list');

// 공지사항 삭제
export const deleteNotification = (id: number) =>
  api.delete<NotificationResponse>(`/api/notification/delete/${id}`);
