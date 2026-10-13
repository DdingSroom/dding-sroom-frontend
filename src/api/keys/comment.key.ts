import { createQueryKeys } from '@lukemorales/query-key-factory';

import {
  getCommentReplies,
  getMyComments,
  getPostComments,
} from '@api/comment.api';

/** ---------- (공통) 게시글 댓글 쿼리 ----------- */
export const comment = createQueryKeys('comment', {
  // 특정 게시글의 댓글 조회
  getComments: (postId: number) => ({
    queryKey: ['post', postId],
    queryFn: () => getPostComments(postId),
  }),
  // 댓글의 대댓글 조회
  getReplies: (commentId: number) => ({
    queryKey: ['replies', commentId],
    queryFn: () => getCommentReplies(commentId),
  }),
  // 내가 쓴 댓글 조회
  getMyComments: () => ({
    queryKey: ['me'],
    queryFn: getMyComments,
  }),
});
