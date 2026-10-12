export const AUTH_API_ENDPOINTS = {
  LOGIN: '/login',
  SIGN_UP: '/user/sign-up',
  CODE_SEND: '/user/code-send',
  CODE_VERIFY: '/user/code-verify',
  REISSUE: '/reissue',
} as const;

export const COMMUNITY_API_ENDPOINTS = {
  POSTS: '/api/community-posts',
  SEARCH: '/api/community-posts/search',
  MY_POSTS: '/api/community-posts/me',
  POST_BY_ID: (postId: number) => `/api/community-posts/${postId}`,
} as const;

export const COMMENT_API_ENDPOINTS = {
  COMMENTS: '/api/community-posts/comments',
  REPLIES_BY_COMMENT: (commentId: number) =>
    `/api/community-posts/comments/${commentId}/replies`,
  COMMENTS_BY_POST: (postId: number) =>
    `/api/community-posts/comments/post/${postId}`,
} as const;

export const RESERVATION_API_ENDPOINTS = {
  RESERVATIONS: '/api/reservations',
  CANCEL: '/api/reservations/cancel',
  MY_RESERVATIONS: '/api/reservations/me',
  ALL: '/api/reservations/all-reservation',
} as const;
