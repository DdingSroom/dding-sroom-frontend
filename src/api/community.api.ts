import { api } from '@shared/api/api';
import { COMMUNITY_API_ENDPOINTS } from '@shared/api/endpoints';

import type { ApiPaths, ApiSchemas } from '../types/api';
import type {
  CommunityListParams,
  CommunityParams,
} from './keys/community.key';

export type CommunityPostRequest = ApiSchemas['CommunityPostRequestDTO'];

type CommunityResponse = ApiSchemas['BaseResponseDTO'];
type CommunitySearchResponse =
  ApiPaths[typeof COMMUNITY_API_ENDPOINTS.SEARCH]['get']['responses'][200]['content']['*/*'];

// 전체 게시글 조회
export const getCommunityPosts = (params: CommunityListParams = {}) =>
  api.get<CommunityResponse>(COMMUNITY_API_ENDPOINTS.POSTS, { params });

// 게시글 검색
export const searchCommunityPosts = (params: CommunityParams = {}) =>
  api.get<CommunitySearchResponse>(COMMUNITY_API_ENDPOINTS.SEARCH, {
    params: {
      post_id: params.postId,
      user_id: params.userId,
      category:
        params.category === undefined ? undefined : Number(params.category),
    },
  });

// 내 게시글 조회
export const getMyCommunityPosts = () =>
  api.get<CommunityResponse>(COMMUNITY_API_ENDPOINTS.MY_POSTS);

// 게시글 상세 조회
export const getCommunityPost = (id: number) =>
  api.get<CommunityResponse>(COMMUNITY_API_ENDPOINTS.POST_BY_ID(id));

// 게시글 작성
export const createCommunityPost = (data: CommunityPostRequest) =>
  api.post<CommunityResponse, CommunityPostRequest>(
    COMMUNITY_API_ENDPOINTS.POSTS,
    data,
  );

// 게시글 수정
export const updateCommunityPost = (data: CommunityPostRequest) =>
  api.put<CommunityResponse, CommunityPostRequest>(
    COMMUNITY_API_ENDPOINTS.POSTS,
    data,
  );

// 게시글 삭제
export const deleteCommunityPost = (data: CommunityPostRequest) =>
  api.delete<CommunityResponse>(COMMUNITY_API_ENDPOINTS.POSTS, { data });
