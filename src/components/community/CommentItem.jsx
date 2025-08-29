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
    <div className="py-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`flex items-center gap-2 ${
                isPostAuthor(comment.user_id)
                  ? 'bg-gradient-to-r from-[#788cff]/15 to-[#788cff]/5 px-3 py-2 rounded-full border border-[#788cff]/20'
                  : 'px-2'
              }`}
            >
              <div className="w-7 h-7 bg-gradient-to-r from-[#788cff] to-[#6a7dff] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {getCommentAuthorName(comment.user_id).charAt(0)}
              </div>
              <span
                className={`text-sm font-semibold ${
                  isPostAuthor(comment.user_id)
                    ? 'text-[#788cff]'
                    : 'text-[#37352f]'
                }`}
              >
                {getCommentAuthorName(comment.user_id)}
              </span>
              {isPostAuthor(comment.user_id) && (
                <span className="text-xs bg-[#788cff] text-white px-2 py-1 rounded-full font-bold">
                  작성자
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#9b9998]">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
              </svg>
              {formatDate(comment.created_at)}
            </div>
          </div>
          <p className="text-sm text-[#37352f] leading-relaxed mb-3 ml-9">
            {comment.comment_content}
          </p>
          <div className="flex items-center gap-3 ml-9">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1 text-xs text-[#788cff] hover:text-[#6a7dff] transition-colors px-3 py-2 hover:bg-[#788cff]/10 rounded-lg touch-manipulation"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z" />
              </svg>
              답글
            </button>
          </div>
        </div>
        {comment.user_id === userId && (
          <button
            onClick={() => handleDeleteComment(comment.id)}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors ml-2 px-3 py-2 hover:bg-red-50 rounded-lg touch-manipulation"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
            </svg>
            삭제
          </button>
        )}
      </div>
      {showReplyInput && (
        <div className="ml-11 mb-4">
          <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="대댓글을 입력하세요..."
                className="flex-1 px-3 py-3 text-sm border border-gray-200/50 rounded-lg bg-white/70 focus:outline-none focus:border-[#788cff] focus:ring-2 focus:ring-[#788cff]/10 transition-all"
                disabled={isSubmitting}
                maxLength={300}
              />
              <button
                onClick={handleReplySubmit}
                disabled={!replyContent.trim() || isSubmitting}
                className="px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#788cff] to-[#6a7dff] rounded-lg hover:from-[#6a7dff] hover:to-[#5b70ff] disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                    작성중
                  </div>
                ) : (
                  '등록'
                )}
              </button>
            </div>
            <div className="text-xs text-[#9b9998] mt-2 text-right">
              {replyContent.length}/300
            </div>
          </div>
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 pl-6 border-l-2 border-gradient-to-b from-[#788cff]/20 to-transparent">
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className="py-3 bg-gradient-to-r from-gray-50/30 to-transparent rounded-r-xl pl-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`flex items-center gap-2 ${
                        isPostAuthor(reply.user_id)
                          ? 'bg-gradient-to-r from-[#788cff]/15 to-[#788cff]/5 px-3 py-1 rounded-full border border-[#788cff]/20'
                          : ''
                      }`}
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-[#9b9998] to-[#73726e] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {getCommentAuthorName(reply.user_id).charAt(0)}
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          isPostAuthor(reply.user_id)
                            ? 'text-[#788cff]'
                            : 'text-[#37352f]'
                        }`}
                      >
                        {getCommentAuthorName(reply.user_id)}
                      </span>
                      {isPostAuthor(reply.user_id) && (
                        <span className="text-xs bg-[#788cff] text-white px-2 py-1 rounded-full font-bold">
                          작성자
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#9b9998]">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                      </svg>
                      {formatDate(reply.created_at)}
                    </div>
                  </div>
                  <p className="text-sm text-[#37352f] leading-relaxed ml-8">
                    {reply.comment_content}
                  </p>
                </div>
                {reply.user_id === userId && (
                  <button
                    onClick={() => handleDeleteComment(reply.id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors ml-2 px-3 py-2 hover:bg-red-50 rounded-lg touch-manipulation"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
                    </svg>
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
