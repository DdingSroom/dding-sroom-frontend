'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useTokenStore from '../../../stores/useTokenStore';
import axiosInstance from '../../../libs/api/instance';
import { anonymizeUsers } from '../../../utils/anonymizeUser';
import CommunityHeader from '@components/community/CommunityHeader';
import CommentItem from '@components/community/CommentItem';
import LoginRequiredModal from '@components/common/LoginRequiredModal';
import Modal from '@components/common/Modal';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';
import FooterNav from '@components/common/FooterNav';

function BottomSafeSpacer({ height = 64 }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
    />
  );
}

export default function PostDetailPage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userMap, setUserMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { accessToken, userId, rehydrate } = useTokenStore();
  const { postId } = useParams();
  const router = useRouter();

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  useEffect(() => {
    setShowLoginModal(!accessToken);
  }, [accessToken]);

  const fetchPostDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/community-posts');

      if (response?.data?.error) {
        setErrorMessage(response.data.error);
        setShowErrorModal(true);
        return;
      }

      const foundPost = (response?.data?.data ?? []).find(
        (p) => p.id === parseInt(postId, 10),
      );

      if (foundPost) {
        setPost(foundPost);
      } else {
        setErrorMessage('존재하지 않는 게시글입니다.');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('게시글 불러오기 실패:', error);
      setErrorMessage('게시글을 불러오는 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/api/community-posts/comments/post/${postId}`,
      );

      if (response?.data?.error) {
        setErrorMessage(response.data.error);
        setShowErrorModal(true);
        return;
      }

      const commentsData = response?.data?.data ?? [];
      setComments(commentsData);

      if (commentsData.length > 0) {
        const anonymousMap = anonymizeUsers(commentsData);
        setUserMap(anonymousMap);
      }
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
    }
  }, [postId]);

  // ✅ 선언 후에 호출
  useEffect(() => {
    if (accessToken && postId) {
      fetchPostDetail();
      fetchComments();
    }
  }, [accessToken, postId, fetchPostDetail, fetchComments]);

  const handleLoginConfirm = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const response = await axiosInstance.post(
        '/api/community-posts/comments',
        {
          post_id: parseInt(postId, 10),
          user_id: userId,
          comment_content: newComment.trim(),
        },
      );

      if (response?.data?.error) {
        setErrorMessage(response.data.error);
        setShowErrorModal(true);
      } else {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      setErrorMessage('댓글 작성 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;

    try {
      const response = await axiosInstance.delete('/api/community-posts', {
        data: {
          post_id: parseInt(postId, 10),
          user_id: userId,
        },
      });

      if (response?.data?.error) {
        setErrorMessage(response.data.error);
        setShowErrorModal(true);
      } else {
        router.push('/community');
      }
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      setErrorMessage('게시글 삭제 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    }
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

  const getCategoryName = (category) =>
    category === 1 ? '일반게시판' : '분실물게시판';

  const getCategoryColor = () => 'text-[#788cff]';

  const isUpdated = (createdAt, updatedAt) => {
    if (!Array.isArray(createdAt) || !Array.isArray(updatedAt)) return false;

    const ts = (arr) =>
      new Date(
        ...arr.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v)),
      ).getTime();

    return Math.abs(ts(updatedAt) - ts(createdAt)) > 1000;
  };

  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex flex-col">
        <CommunityHeader title="게시글 상세" />
        <LoginRequiredModal
          isOpen={showLoginModal}
          onConfirm={handleLoginConfirm}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex flex-col">
        <CommunityHeader title="게시글 상세" />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#788cff] border-t-transparent"></div>
            <div className="text-[#73726e] font-medium">
              게시글을 불러오는 중...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex flex-col">
        <CommunityHeader title="게시글 상세" />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-12 border border-white/20 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
            </div>
            <p className="text-[#73726e] font-semibold mb-2">
              게시글을 찾을 수 없습니다
            </p>
            <p className="text-sm text-[#9b9998]">
              삭제되었거나 존재하지 않는 게시글입니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex flex-col">
      <CommunityHeader title="게시글 상세" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-32">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg mb-6">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`px-4 py-2 rounded-full text-xs font-bold ${getCategoryColor(post.category)} bg-gradient-to-r from-[#788cff]/10 to-[#788cff]/5 border border-[#788cff]/20`}
              >
                {getCategoryName(post.category)}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#9b9998]">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9H3V11H21V9M12 4L15 7H9L12 4Z" />
                </svg>
                글쓴이
              </div>
            </div>

            <h1 className="text-2xl font-bold text-[#37352f] mb-4 leading-relaxed">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-[#9b9998]">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                  </svg>
                  {formatDate(
                    isUpdated(post.created_at, post.updated_at)
                      ? post.updated_at
                      : post.created_at,
                  )}
                  {isUpdated(post.created_at, post.updated_at) && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                      수정됨
                    </span>
                  )}
                </div>
              </div>

              {post.user_id === userId && (
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/community/${postId}/edit`)}
                    className="flex items-center gap-1 text-xs text-[#788cff] hover:text-[#6a7dff] transition-colors px-3 py-2 hover:bg-[#788cff]/10 rounded-lg"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                    </svg>
                    수정
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors px-3 py-2 hover:bg-red-50 rounded-lg"
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
                </div>
              )}
            </div>

            <div className="text-base text-[#37352f] leading-relaxed whitespace-pre-wrap mb-8 bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
              {post.content}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <svg
                className="w-5 h-5 text-[#788cff]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z" />
              </svg>
              <span className="text-lg font-bold text-[#37352f]">댓글</span>
              <span className="bg-[#788cff]/10 text-[#788cff] px-2 py-1 rounded-full text-sm font-semibold">
                {comments.length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg mb-6">
          {comments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#788cff]/10 to-[#ff8c78]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#9b9998]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z" />
                </svg>
              </div>
              <p className="text-[#73726e] font-medium mb-2">
                아직 댓글이 없습니다
              </p>
              <p className="text-sm text-[#9b9998]">
                첫 번째 댓글을 작성해보세요!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100/50">
              {comments.map((comment) => (
                <div key={comment.id} className="px-8">
                  <CommentItem
                    comment={comment}
                    postId={parseInt(postId, 10)}
                    postAuthorId={post.user_id}
                    onCommentUpdate={fetchComments}
                    onError={(message) => {
                      setErrorMessage(message);
                      setShowErrorModal(true);
                    }}
                    userMap={userMap}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg
                className="w-5 h-5 text-[#788cff]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z" />
              </svg>
              <span className="text-sm font-semibold text-[#37352f]">
                댓글 작성
              </span>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 px-4 py-4 border border-gray-200/50 rounded-xl bg-white/50 focus:outline-none focus:border-[#788cff] focus:ring-2 focus:ring-[#788cff]/10 focus:bg-white transition-all placeholder-gray-400"
                disabled={isSubmittingComment}
                maxLength={500}
              />
              <button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || isSubmittingComment}
                className="px-6 py-4 bg-gradient-to-r from-[#788cff] to-[#6a7dff] text-white rounded-xl hover:from-[#6a7dff] hover:to-[#5b70ff] disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {isSubmittingComment ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    작성중
                  </div>
                ) : (
                  '등록'
                )}
              </button>
            </div>
            <div className="text-xs text-[#9b9998] mt-2 text-right">
              {newComment.length}/500
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="오류"
        content={errorMessage}
        showCancel={false}
      />

      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav />
    </div>
  );
}
