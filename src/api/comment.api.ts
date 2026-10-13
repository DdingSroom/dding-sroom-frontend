import { api } from '@shared/api/api';
import { COMMENT_API_ENDPOINTS } from '@shared/api/endpoints';

import type { ApiPaths, ApiSchemas } from '../types/api';

export type CommunityCommentRequest =
  ApiSchemas['CommunityPostCommentRequestDTO'];

type CommentResponse = ApiSchemas['BaseResponseDTO'];
type MyCommentsResponse =
  ApiPaths[typeof COMMENT_API_ENDPOINTS.MY_COMMENTS]['get']['responses'][200]['content']['*/*'];

// 내가 작성한 댓글 조회
export const getMyComments = () =>
  api.get<MyCommentsResponse>(COMMENT_API_ENDPOINTS.MY_COMMENTS);

// 특정 게시글의 댓글 조회
export const getPostComments = (postId: number) =>
  api.get<CommentResponse>(COMMENT_API_ENDPOINTS.COMMENTS_BY_POST(postId));

// 댓글의 대댓글 조회
export const getCommentReplies = (commentId: number) =>
  api.get<CommentResponse>(COMMENT_API_ENDPOINTS.REPLIES_BY_COMMENT(commentId));

// 댓글 작성
export const createComment = (data: CommunityCommentRequest) =>
  api.post<CommentResponse, CommunityCommentRequest>(
    COMMENT_API_ENDPOINTS.COMMENTS,
    data,
  );

// 댓글 삭제
export const deleteComment = (data: CommunityCommentRequest) =>
  api.delete<CommentResponse>(COMMENT_API_ENDPOINTS.COMMENTS, { data });
