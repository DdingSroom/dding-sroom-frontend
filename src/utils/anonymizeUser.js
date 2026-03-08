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
    .sort((a, b) => {
      const timeA = new Date(
        ...a.created_at.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v)),
      );
      const timeB = new Date(
        ...b.created_at.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v)),
      );
      return timeA - timeB;
    })
    .forEach((comment) => {
      if (!userMap.has(comment.user_id)) {
        userMap.set(comment.user_id, `익명${anonymousCounter}`);
        anonymousCounter++;
      }
    });

  return userMap;
};

export const getAnonymousName = (userId, userMap) => {
  return userMap.get(userId) || `익명${userId}`;
};
