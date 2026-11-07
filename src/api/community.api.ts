import { api } from '@shared/api/api';
import { COMMUNITY_API_ENDPOINTS } from '@shared/api/endpoints';

import type { ApiPaths, ApiSchemas } from '../types/api';

export type CommunityPostRequest = ApiSchemas['CommunityPostRequestDTO'];

type CommunitySearchQuery = NonNullable<
  ApiPaths['/api/community-posts/search']['get']['parameters']['query']
>;

export type CommunityParams = {
  postId?: CommunitySearchQuery['post_id'];
  userId?: CommunitySearchQuery['user_id'];
  category?: NonNullable<CommunitySearchQuery['category']> | string;
};

export type MyCommunityPostsParams = NonNullable<
  ApiPaths['/api/community-posts/me']['get']['parameters']['query']
>;

type CommunityListResponse =
  ApiSchemas['BaseResponseDTOListCommunityPostResponseDTO'];

type CommunityPostResponse =
  ApiSchemas['BaseResponseDTOCommunityPostResponseDTO'];

type CommunitySearchResponse = ApiSchemas['CommunityPostSearchResponse'];

type CommunityDeleteResponse = ApiSchemas['BaseResponseDTOVoid'];

// 전체 게시글 조회
export const getCommunityPosts = () =>
  api.get<CommunityListResponse>(COMMUNITY_API_ENDPOINTS.POSTS);

// 게시글 검색
export const searchCommunityPosts = (params: CommunityParams = {}) => {
  const query: CommunitySearchQuery = {
    post_id: params.postId,
    user_id: params.userId,
    category:
      params.category === undefined ? undefined : Number(params.category),
  };

  return api.get<CommunitySearchResponse>(COMMUNITY_API_ENDPOINTS.SEARCH, {
    params: query,
  });
};

// 내 게시글 조회
export const getMyCommunityPosts = (params: MyCommunityPostsParams = {}) =>
  api.get<CommunityListResponse>(COMMUNITY_API_ENDPOINTS.MY_POSTS, { params });

// 게시글 상세 조회
export const getCommunityPost = (id: number) =>
  api.get<CommunityPostResponse>(COMMUNITY_API_ENDPOINTS.POST_BY_ID(id));

// 특정 사용자의 게시글 조회
export const getCommunityPostsByUser = (userId: number) =>
  api.get<CommunityListResponse>(COMMUNITY_API_ENDPOINTS.POSTS_BY_USER(userId));

// 게시글 작성
export const createCommunityPost = (data: CommunityPostRequest) =>
  api.post<CommunityPostResponse, CommunityPostRequest>(
    COMMUNITY_API_ENDPOINTS.POSTS,
    data,
  );

// 게시글 수정
export const updateCommunityPost = (data: CommunityPostRequest) =>
  api.put<CommunityPostResponse, CommunityPostRequest>(
    COMMUNITY_API_ENDPOINTS.POSTS,
    data,
  );

// 게시글 삭제
export const deleteCommunityPost = (data: CommunityPostRequest) =>
  api.delete<CommunityDeleteResponse>(COMMUNITY_API_ENDPOINTS.POSTS, { data });
