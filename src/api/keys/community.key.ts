import { createQueryKeys } from '@lukemorales/query-key-factory';

import {
  getCommunityPost,
  getCommunityPosts,
  getMyCommunityPosts,
  searchCommunityPosts,
} from '../use-community';

export interface CommunityListParams {
  page?: number;
  size?: number;
}

export interface CommunityParams {
  postId?: number;
  userId?: number;
  category?: string;
}

/** ---------- (공통) 커뮤니티 쿼리 ----------- */
export const community = createQueryKeys('community', {
  // 전체 커뮤니티 게시글 조회
  getList: (params: CommunityListParams = {}) => ({
    queryKey: ['all', params],
    queryFn: () => getCommunityPosts(params),
  }),
  // 특정 커뮤니티 게시글 조회
  getSearchList: (params: CommunityParams) => ({
    queryKey: [params ?? {}],
    queryFn: () => searchCommunityPosts(params),
  }),
  // 내가 쓴 커뮤니티 게시글 조회
  getMyList: () => ({
    queryKey: ['me'],
    queryFn: () => getMyCommunityPosts(),
  }),
  // 상세 커뮤니티 게시글 조회
  getById: (id: number) => ({
    queryKey: [id],
    queryFn: () => getCommunityPost(id),
  }),
});
