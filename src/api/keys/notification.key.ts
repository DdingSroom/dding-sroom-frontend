import { createQueryKeys } from '@lukemorales/query-key-factory';

/** ---------- (공통) 공지사항 쿼리 ----------- */
export const notification = createQueryKeys('notification', {
  // 전체 공지사항 조회
  getList: () => ({
    queryKey: ['all'],
    queryFn: () => null,
  }),
  // 특정 공지사항 상세 조회
  getById: (id: number) => ({
    queryKey: [id],
    queryFn: () => null,
  }),
  // 공지사항 개수 조회
  getCount: () => ({
    queryKey: ['count'],
    queryFn: () => null,
  }),
});
