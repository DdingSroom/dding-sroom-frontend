import { createQueryKeys } from '@lukemorales/query-key-factory';

import {
  getNotification,
  getNotifications,
  getRecentNotificationsCount,
} from '../use-notification';

/** ---------- (공통) 공지사항 쿼리 ----------- */
export const notification = createQueryKeys('notification', {
  // 전체 공지사항 조회
  getList: () => ({
    queryKey: ['all'],
    queryFn: () => getNotifications(),
  }),
  // 특정 공지사항 상세 조회
  getById: (id: number) => ({
    queryKey: [id],
    queryFn: () => getNotification(id),
  }),
  // 공지사항 개수 조회
  getCount: () => ({
    queryKey: ['count'],
    queryFn: () => getRecentNotificationsCount(),
  }),
});
