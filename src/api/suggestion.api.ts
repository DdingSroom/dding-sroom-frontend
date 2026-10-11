import { api } from '@shared/api/api';
import { SUGGESTION_API_ENDPOINTS } from '@shared/api/endpoints';

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
  ApiPaths[typeof SUGGESTION_API_ENDPOINTS.COMMENTS]['get']['responses'][200]['content']['*/*'];
type SuggestionCommentMutationResponse =
  ApiPaths[typeof SUGGESTION_API_ENDPOINTS.COMMENTS]['post']['responses'][200]['content']['*/*'];

type SuggestionListResponse =
  ApiPaths[typeof SUGGESTION_API_ENDPOINTS.SUGGESTIONS]['get']['responses'][200]['content']['*/*'];
type SuggestionMutationResponse =
  ApiPaths[typeof SUGGESTION_API_ENDPOINTS.SUGGESTIONS]['post']['responses'][200]['content']['*/*'];
type SuggestionImagesResponse =
  ApiPaths[typeof SUGGESTION_API_ENDPOINTS.IMAGES]['get']['responses'][200]['content']['*/*'];
type SuggestionImageUploadResponse =
  ApiPaths[typeof SUGGESTION_API_ENDPOINTS.IMAGES]['post']['responses'][200]['content']['*/*'];

/* ------------ 건의사항 -------------- */
// 건의사항 목록 조회
export const getSuggestions = (params: SuggestionParams = {}) => {
  const query: ApiPaths[typeof SUGGESTION_API_ENDPOINTS.SUGGESTIONS]['get']['parameters']['query'] =
    {
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
export const getSuggestionImages = (suggestId: number) =>
  api.get<SuggestionImagesResponse>(SUGGESTION_API_ENDPOINTS.IMAGES, {
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
    SUGGESTION_API_ENDPOINTS.IMAGES,
    formData,
  );
};

/* ------------ 건의사항 코멘트 -------------- */
// 건의사항 코멘트 조회
export const getSuggestionComments = (suggestId: number) =>
  api.get<SuggestionCommentsResponse>(SUGGESTION_API_ENDPOINTS.COMMENTS, {
    params: { suggest_post_id: suggestId },
  });

// 건의사항 코멘트 작성
export const createSuggestionComment = (data: SuggestionCommentCreateRequest) =>
  api.post<SuggestionCommentMutationResponse, SuggestionCommentCreateRequest>(
    SUGGESTION_API_ENDPOINTS.COMMENTS,
    data,
  );

// 건의사항 코멘트 수정
export const updateSuggestionComment = (data: SuggestionCommentUpdateRequest) =>
  api.put<SuggestionCommentMutationResponse, SuggestionCommentUpdateRequest>(
    SUGGESTION_API_ENDPOINTS.COMMENTS,
    data,
  );

// 건의사항 코멘트 삭제
export const deleteSuggestionComment = (commentId: number) =>
  api.delete<SuggestionCommentMutationResponse>(
    SUGGESTION_API_ENDPOINTS.COMMENT_BY_ID(commentId),
  );
