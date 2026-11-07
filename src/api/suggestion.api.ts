import { api } from '@shared/api/api';
import { SUGGESTION_API_ENDPOINTS } from '@shared/api/endpoints';

import type { ApiPaths, ApiSchemas } from '../types/api';

export type SuggestionCreateRequest = ApiSchemas['SuggestPostCreateRequestDTO'];

export type SuggestionUpdateRequest = ApiSchemas['SuggestPostUpdateRequestDTO'];

export type SuggestionImageUploadRequest =
  ApiSchemas['SuggestPostImageUploadRequestDTO'];

export type SuggestionCommentCreateRequest =
  ApiSchemas['SuggestPostCommentCreateRequestDTO'];

export type SuggestionCommentUpdateRequest =
  ApiSchemas['SuggestPostCommentUpdateRequestDTO'];

type SuggestionQuery = NonNullable<
  ApiPaths['/api/suggestions']['get']['parameters']['query']
>;

export type SuggestionParams = {
  suggestId?: NonNullable<SuggestionQuery['suggest_id']> | string;
  userId?: SuggestionQuery['user_id'];
  category?: SuggestionQuery['category'];
  location?: SuggestionQuery['location'];
  isAnswered?: SuggestionQuery['is_answered'];
};

type SuggestionListResponse = ApiSchemas['SuggestionListResponse'];

type SuggestionMutationResponse = ApiSchemas['SuggestionMessageResponse'];

type SuggestionImagesResponse = ApiSchemas['SuggestionImageListResponse'];

type SuggestionImageUploadResponse =
  ApiSchemas['SuggestionImageUploadResponse'];

type SuggestionCommentsResponse = ApiSchemas['SuggestionAnswerListResponse'];

/* ------------ 건의사항 -------------- */

// 건의사항 목록 조회
export const getSuggestions = (params: SuggestionParams = {}) => {
  const query: SuggestionQuery = {
    suggest_id:
      params.suggestId === undefined ? undefined : Number(params.suggestId),
    user_id: params.userId,
    category: params.category,
    location: params.location,
    is_answered: params.isAnswered,
  };

  return api.get<SuggestionListResponse>(SUGGESTION_API_ENDPOINTS.SUGGESTIONS, {
    params: query,
  });
};

// 건의사항 생성
export const createSuggestion = (data: SuggestionCreateRequest) =>
  api.post<SuggestionMutationResponse, SuggestionCreateRequest>(
    SUGGESTION_API_ENDPOINTS.SUGGESTIONS,
    data,
  );

// 건의사항 수정
export const updateSuggestion = (data: SuggestionUpdateRequest) =>
  api.put<SuggestionMutationResponse, SuggestionUpdateRequest>(
    SUGGESTION_API_ENDPOINTS.SUGGESTIONS,
    data,
  );

// 건의사항 삭제
export const deleteSuggestion = (suggestId: number) =>
  api.delete<SuggestionMutationResponse>(
    SUGGESTION_API_ENDPOINTS.SUGGESTION_BY_ID(suggestId),
  );

/* ------------ 건의사항 이미지 -------------- */

// 건의사항 이미지 조회
export const getSuggestionImages = (suggestId: number) => {
  const query: ApiPaths['/api/suggestions/images']['get']['parameters']['query'] =
    {
      suggest_post_id: suggestId,
    };

  return api.get<SuggestionImagesResponse>(SUGGESTION_API_ENDPOINTS.IMAGES, {
    params: query,
  });
};

// 건의사항 이미지 업로드
export const uploadSuggestionImage = (
  request: SuggestionImageUploadRequest,
  imageFile: File,
) => {
  const formData = new FormData();

  formData.append(
    'request',
    new Blob([JSON.stringify(request)], {
      type: 'application/json',
    }),
  );

  formData.append('image_file', imageFile);

  return api.post<SuggestionImageUploadResponse, FormData>(
    SUGGESTION_API_ENDPOINTS.IMAGES,
    formData,
  );
};

// 건의사항 이미지 삭제
export const deleteSuggestionImage = (imageId: number) =>
  api.delete<SuggestionMutationResponse>(
    SUGGESTION_API_ENDPOINTS.IMAGE_BY_ID(imageId),
  );

/* ------------ 건의사항 코멘트 -------------- */

// 건의사항 코멘트 조회
export const getSuggestionComments = (suggestId: number) => {
  const query: ApiPaths['/api/suggestions/comments']['get']['parameters']['query'] =
    {
      suggest_post_id: suggestId,
    };

  return api.get<SuggestionCommentsResponse>(
    SUGGESTION_API_ENDPOINTS.COMMENTS,
    { params: query },
  );
};

// 건의사항 코멘트 작성
export const createSuggestionComment = (data: SuggestionCommentCreateRequest) =>
  api.post<SuggestionMutationResponse, SuggestionCommentCreateRequest>(
    SUGGESTION_API_ENDPOINTS.COMMENTS,
    data,
  );

// 건의사항 코멘트 수정
export const updateSuggestionComment = (data: SuggestionCommentUpdateRequest) =>
  api.put<SuggestionMutationResponse, SuggestionCommentUpdateRequest>(
    SUGGESTION_API_ENDPOINTS.COMMENTS,
    data,
  );

// 건의사항 코멘트 삭제
export const deleteSuggestionComment = (commentId: number) =>
  api.delete<SuggestionMutationResponse>(
    SUGGESTION_API_ENDPOINTS.COMMENT_BY_ID(commentId),
  );
