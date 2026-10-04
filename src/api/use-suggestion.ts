import { api } from '@shared/api/api';

import type { ApiPaths, ApiSchemas } from '../types/api';
import type { SuggestionParams } from './keys/suggestion.key';

export type SuggestionCreateRequest = ApiSchemas['SuggestPostCreateRequestDTO'];
export type SuggestionUpdateRequest = ApiSchemas['SuggestPostUpdateRequestDTO'];
export type SuggestionImageUploadRequest =
  ApiSchemas['SuggestPostImageUploadRequestDTO'];

export type SuggestionCommentCreateRequest =
  ApiSchemas['SuggestPostCommentCreateRequestDTO'];
export type SuggestionCommentUpdateRequest =
  ApiSchemas['SuggestPostCommentUpdateRequestDTO'];

type SuggestionCommentsResponse =
  ApiPaths['/api/suggestions/comments']['get']['responses'][200]['content']['*/*'];
type SuggestionCommentMutationResponse =
  ApiPaths['/api/suggestions/comments']['post']['responses'][200]['content']['*/*'];

type SuggestionListResponse =
  ApiPaths['/api/suggestions']['get']['responses'][200]['content']['*/*'];
type SuggestionMutationResponse =
  ApiPaths['/api/suggestions']['post']['responses'][200]['content']['*/*'];
type SuggestionImagesResponse =
  ApiPaths['/api/suggestions/images']['get']['responses'][200]['content']['*/*'];
type SuggestionImageUploadResponse =
  ApiPaths['/api/suggestions/images']['post']['responses'][200]['content']['*/*'];

/* ------------ 건의사항 -------------- */
// 건의사항 목록 조회
export const getSuggestions = (params: SuggestionParams = {}) => {
  const query: ApiPaths['/api/suggestions']['get']['parameters']['query'] = {
    suggest_id:
      params.suggestId === undefined ? undefined : Number(params.suggestId),
    user_id: params.userId,
    category: params.category,
    location: params.location,
    is_answered: params.isAnswered,
  };

  return api.get<SuggestionListResponse>('/api/suggestions', { params: query });
};

// 건의사항 생성
export const createSuggestion = (data: SuggestionCreateRequest) =>
  api.post<SuggestionMutationResponse, SuggestionCreateRequest>(
    '/api/suggestions',
    data,
  );

// 건의사항 수정
export const updateSuggestion = (data: SuggestionUpdateRequest) =>
  api.put<SuggestionMutationResponse, SuggestionUpdateRequest>(
    '/api/suggestions',
    data,
  );

// 건의사항 삭제
export const deleteSuggestion = (suggestId: number) =>
  api.delete<SuggestionMutationResponse>(`/api/suggestions/${suggestId}`);

/* ------------ 건의사항 이미지 -------------- */
// 건의사항 이미지 조회
export const getSuggestionImages = (suggestId: number) =>
  api.get<SuggestionImagesResponse>('/api/suggestions/images', {
    params: { suggest_post_id: suggestId },
  });

// 건의사항 이미지 업로드
export const uploadSuggestionImage = (
  request: SuggestionImageUploadRequest,
  imageFile: File,
) => {
  const formData = new FormData();
  formData.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' }),
  );
  formData.append('image_file', imageFile);

  return api.post<SuggestionImageUploadResponse, FormData>(
    '/api/suggestions/images',
    formData,
  );
};

/* ------------ 건의사항 코멘트 -------------- */
// 건의사항 코멘트 조회
export const getSuggestionComments = (suggestId: number) =>
  api.get<SuggestionCommentsResponse>('/api/suggestions/comments', {
    params: { suggest_post_id: suggestId },
  });

// 건의사항 코멘트 작성
export const createSuggestionComment = (data: SuggestionCommentCreateRequest) =>
  api.post<SuggestionCommentMutationResponse, SuggestionCommentCreateRequest>(
    '/api/suggestions/comments',
    data,
  );

// 건의사항 코멘트 수정
export const updateSuggestionComment = (data: SuggestionCommentUpdateRequest) =>
  api.put<SuggestionCommentMutationResponse, SuggestionCommentUpdateRequest>(
    '/api/suggestions/comments',
    data,
  );

// 건의사항 코멘트 삭제
export const deleteSuggestionComment = (commentId: number) =>
  api.delete<SuggestionCommentMutationResponse>(
    `/api/suggestions/comments/${commentId}`,
  );
