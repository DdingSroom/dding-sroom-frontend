import { createQueryKeys } from '@lukemorales/query-key-factory';

export interface CommunityParams {
  postId?: number; // 현재 사용 X
  userId?: number; // 현재 사용 X
  category?: string; // 현재 /api/community-posts/search 에서 혼자 사용되고 있는 params
}

/** ---------- (공통) 커뮤니티 쿼리 ----------- */
export const community = createQueryKeys('community', {
  // 전체 커뮤니티 게시글 조회
  getList: () => ({
    queryKey: ['all'],
    queryFn: null,
  }),
  // 특정 커뮤니티 게시글 조회
  getSearchList: (params: CommunityParams) => ({
    queryKey: [params ?? {}],
    queryFn: null,
  }),
  // 내가 쓴 커뮤니티 게시글 조회
  getMyList: () => ({
    queryKey: ['me'],
    queryFn: null,
  }),
  // 상세 커뮤니티 게시글 조회
  getById: (id: number) => ({
    queryKey: [id],
    queryFn: null,
  }),
});
