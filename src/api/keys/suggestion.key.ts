import { createQueryKeys } from '@lukemorales/query-key-factory';

export interface SuggestionParams {
  suggestId?: string;
  userId?: number;
  category?: string;
  location?: string;
  isAnswered?: boolean;
}

/** ---------- (공통) 건의사항 쿼리 ----------- */
export const suggestion = createQueryKeys('suggestion', {
  // 건의사항 조회
  getList: (params: SuggestionParams) => ({
    queryKey: [params ?? {}],
    queryFn: null,
  }),
  // 건의사항 코멘트 조회
  getComments: (id: number) => ({
    queryKey: [id],
    queryFn: null,
  }),
  // 건의사항 이미지 조회
  getImages: (id: number) => ({
    queryKey: [id],
    queryFn: null,
  }),
});
