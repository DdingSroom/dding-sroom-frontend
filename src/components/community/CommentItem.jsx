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

  const getCommentAuthorName = (commentUserId) => {
    if (commentUserId === postAuthorId) {
      return '익명 (글쓴이)';
    }
    return getAnonymousName(commentUserId, userMap);
  };

  const isPostAuthor = (commentUserId) => {
    return commentUserId === postAuthorId;
  };

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray)) return '';
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour || 0, minute || 0);

    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes}분 전`;
      }
      return `${Math.floor(diffInHours)}시간 전`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays)}일 전`;
    } else {
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const response = await axiosInstance.delete(
        '/api/community-posts/comments',
        {
          data: {
            comment_id: commentId,
            user_id: userId,
          },
        },
      );

      if (response.data.error) {
        if (
          response.data.error.includes(
            '대댓글이 있는 댓글은 삭제할 수 없습니다',
          )
        ) {
          alert('대댓글이 달린 댓글은 삭제할 수 없습니다.');
        } else {
          onError(response.data.error);
        }
      } else {
        onCommentUpdate();
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      onError('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        '/api/community-posts/comments',
        {
          post_id: postId,
          user_id: userId,
          comment_content: replyContent,
          parent_comment_id: comment.id,
        },
      );

      if (response.data.error) {
        onError(response.data.error);
      } else {
        setReplyContent('');
        setShowReplyInput(false);
        onCommentUpdate();
      }
    } catch (error) {
      console.error('대댓글 작성 실패:', error);
      onError('대댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-sm font-medium ${
                isPostAuthor(comment.user_id)
                  ? 'text-[#788cff] bg-[#788cff]/10 px-2 py-1 rounded-md'
                  : 'text-[#37352f]'
              }`}
            >
              {getCommentAuthorName(comment.user_id)}
            </span>
            <span className="text-xs text-[#9b9998]">
              {formatDate(comment.created_at)}
            </span>
          </div>
          <p className="text-sm text-[#37352f] leading-relaxed mb-2">
            {comment.comment_content}
          </p>
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-xs text-[#788cff] hover:text-[#6a7dff] transition-colors"
          >
            댓글달기
          </button>
        </div>
        {comment.user_id === userId && (
          <button
            onClick={() => handleDeleteComment(comment.id)}
            className="text-xs text-red-500 hover:text-red-600 transition-colors ml-2"
          >
            삭제
          </button>
        )}
      </div>

      {showReplyInput && (
        <div className="ml-4 mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="대댓글을 입력하세요..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#788cff]"
              disabled={isSubmitting}
            />
            <button
              onClick={handleReplySubmit}
              disabled={!replyContent.trim() || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#788cff] rounded-lg hover:bg-[#6a7dff] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '작성중...' : '등록'}
            </button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 pl-4 border-l border-gray-100">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="py-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-medium ${
                        isPostAuthor(reply.user_id)
                          ? 'text-[#788cff] bg-[#788cff]/10 px-2 py-1 rounded-md'
                          : 'text-[#37352f]'
                      }`}
                    >
                      {getCommentAuthorName(reply.user_id)}
                    </span>
                    <span className="text-xs text-[#9b9998]">
                      {formatDate(reply.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-[#37352f] leading-relaxed">
                    {reply.comment_content}
                  </p>
                </div>
                {reply.user_id === userId && (
                  <button
                    onClick={() => handleDeleteComment(reply.id)}
                    className="text-xs text-red-500 hover:text-red-600 transition-colors ml-2"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
