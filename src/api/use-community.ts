import { api } from '@shared/api/api';

import type { ApiPaths, ApiSchemas } from '../types/api';
import type {
  CommunityListParams,
  CommunityParams,
} from './keys/community.key';

export type CommunityPostRequest = ApiSchemas['CommunityPostRequestDTO'];

type CommunityResponse = ApiSchemas['BaseResponseDTO'];
type CommunitySearchResponse =
  ApiPaths['/api/community-posts/search']['get']['responses'][200]['content']['*/*'];

// 전체 게시글 조회
export const getCommunityPosts = (params: CommunityListParams = {}) =>
  api.get<CommunityResponse>('/api/community-posts', { params });

// 게시글 검색
export const searchCommunityPosts = (params: CommunityParams = {}) =>
  api.get<CommunitySearchResponse>('/api/community-posts/search', {
    params: {
      post_id: params.postId,
      user_id: params.userId,
      category:
        params.category === undefined ? undefined : Number(params.category),
    },
  });

// 내 게시글 조회
export const getMyCommunityPosts = () =>
  api.get<CommunityResponse>('/api/community-posts/me');

// 게시글 상세 조회
export const getCommunityPost = (id: number) =>
  api.get<CommunityResponse>(`/api/community-posts/${id}`);

// 게시글 작성
export const createCommunityPost = (data: CommunityPostRequest) =>
  api.post<CommunityResponse, CommunityPostRequest>(
    '/api/community-posts',
    data,
  );

// 게시글 수정
export const updateCommunityPost = (data: CommunityPostRequest) =>
  api.put<CommunityResponse, CommunityPostRequest>(
    '/api/community-posts',
    data,
  );

// 게시글 삭제
export const deleteCommunityPost = (data: CommunityPostRequest) =>
  api.delete<CommunityResponse>('/api/community-posts', { data });
