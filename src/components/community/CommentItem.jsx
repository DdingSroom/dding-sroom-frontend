'use client';

import { useState } from 'react';
import useTokenStore from '../../stores/useTokenStore';
import axiosInstance from '../../libs/api/instance';
import { getAnonymousName } from '../../utils/anonymizeUser';

const CommentItem = ({
  comment,
  postId,
  postAuthorId,
  onCommentUpdate,
  onError,
  userMap,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useTokenStore();

  const isPostAuthor = (uid) => uid === postAuthorId;

  const anonName = (uid) => getAnonymousName(uid, userMap);

  const formatDate = (arr) => {
    if (!Array.isArray(arr)) return '';
    const [y, m, d, h, min] = arr;
    const date = new Date(y, (m || 1) - 1, d || 1, h || 0, min || 0);
    const now = new Date();
    const diff = now - date;
    const hrs = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);
    if (hrs < 24)
      return hrs < 1
        ? `${Math.floor(diff / (1000 * 60))}분 전`
        : `${Math.floor(hrs)}시간 전`;
    if (days < 30) return `${Math.floor(days)}일 전`;
    return `${y}.${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`;
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      const res = await axiosInstance.delete('/api/community-posts/comments', {
        data: { comment_id: commentId, user_id: userId },
      });
      if (res.data.error) onError(res.data.error);
      else onCommentUpdate();
    } catch {
      onError('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post('/api/community-posts/comments', {
        post_id: postId,
        user_id: userId,
        comment_content: replyContent.trim(),
        parent_comment_id: comment.id,
      });
      if (res.data.error) onError(res.data.error);
      else {
        setReplyContent('');
        setShowReplyInput(false);
        onCommentUpdate();
      }
    } catch {
      onError('대댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-3 border-b border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-[13px]">
            <span
              className={`font-medium ${
                isPostAuthor(comment.user_id)
                  ? 'text-[#788DFF]'
                  : 'text-gray-800'
              }`}
            >
              {anonName(comment.user_id)}
              {isPostAuthor(comment.user_id) && '(글쓴이)'}
            </span>
            <span className="text-[12px] text-gray-400">
              {formatDate(comment.created_at)}
            </span>
          </div>

          <p className="mt-1 text-[14px] text-gray-800 leading-relaxed">
            {comment.comment_content}
          </p>

          <div className="mt-1 flex gap-3 text-[12px] text-gray-500">
            <button
              onClick={() => setShowReplyInput((v) => !v)}
              className="hover:text-[#788DFF]"
            >
              답글
            </button>
            {comment.user_id === userId && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 hover:text-red-600"
              >
                삭제
              </button>
            )}
          </div>
        </div>
      </div>

      {showReplyInput && (
        <div className="mt-2 pl-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="대댓글을 입력하세요..."
              className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#788DFF] focus:ring-[#788DFF]/20"
              disabled={isSubmitting}
              maxLength={300}
            />
            <button
              onClick={handleReplySubmit}
              disabled={!replyContent.trim() || isSubmitting}
              className="px-3 py-2 rounded-md text-sm text-white bg-[#788DFF] hover:bg-[#6177ff] disabled:bg-gray-300"
            >
              등록
            </button>
          </div>
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="mt-2 pl-3 border-l border-gray-200 space-y-2">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="text-[13px]">
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium ${
                    isPostAuthor(reply.user_id)
                      ? 'text-[#788DFF]'
                      : 'text-gray-800'
                  }`}
                >
                  {anonName(reply.user_id)}
                  {isPostAuthor(reply.user_id) && '(글쓴이)'}
                </span>
                <span className="text-[12px] text-gray-400">
                  {formatDate(reply.created_at)}
                </span>
              </div>
              <p className="ml-2 mt-0.5 text-gray-700">
                {reply.comment_content}
              </p>
              {reply.user_id === userId && (
                <button
                  onClick={() => handleDeleteComment(reply.id)}
                  className="mt-1 text-[12px] text-red-500 hover:text-red-600"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
