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
  POSTS_BY_USER: (userId: number) => `/api/community-posts/user/${userId}`,
  POST_BY_ID: (postId: number) => `/api/community-posts/${postId}`,
} as const;

export const NOTIFICATION_API_ENDPOINTS = {
  UPDATE: '/api/notification/update',
  VIEW: '/api/notification/view',
  READ: '/api/notification/read',
  CREATE: '/api/notification/create',
  BY_ID: (notificationId: number) => `/api/notification/${notificationId}`,
  RECENT_COUNT: '/api/notification/recent-count',
  LIST: '/api/notification/list',
  DELETE: (notificationId: number) =>
    `/api/notification/delete/${notificationId}`,
} as const;

export const SUGGESTION_API_ENDPOINTS = {
  SUGGESTIONS: '/api/suggestions',
  SUGGESTION_BY_ID: (suggestId: number) => `/api/suggestions/${suggestId}`,
  IMAGES: '/api/suggestions/images',
  IMAGE_BY_ID: (imageId: number) => `/api/suggestions/images/${imageId}`,
  COMMENTS: '/api/suggestions/comments',
  COMMENT_BY_ID: (commentId: number) =>
    `/api/suggestions/comments/${commentId}`,
} as const;
