import { parseCommunityDate } from '@utils/post-preview';

export const anonymizeUsers = (comments) => {
  const userMap = new Map();
  let anonymousCounter = 1;

  const flattenComments = (commentsArray) => {
    const result = [];
    commentsArray.forEach((comment) => {
      result.push(comment);
      if (comment.replies && comment.replies.length > 0) {
        result.push(...comment.replies);
      }
    });
    return result;
  };

  const allComments = flattenComments(comments);

  allComments
    .sort(
      (a, b) =>
        (parseCommunityDate(a.created_at)?.getTime() ?? 0) -
        (parseCommunityDate(b.created_at)?.getTime() ?? 0),
    )
    .forEach((comment) => {
      if (!userMap.has(comment.user_id)) {
        userMap.set(comment.user_id, `익명${anonymousCounter}`);
        anonymousCounter++;
      }
    });

  return userMap;
};

export const getAnonymousName = (userId, userMap) =>
  userMap.get(userId) || `익명${userId}`;
