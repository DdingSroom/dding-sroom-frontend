'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (accessToken && postId) {
      fetchPostDetail();
      fetchComments();
    }
  }, [accessToken, postId]);

  const fetchPostDetail = async () => {
    try {
      const response = await axiosInstance.get('/api/community-posts');

      if (response.data.error) {
        setErrorMessage(response.data.error);
        setShowErrorModal(true);
      } else {
        const foundPost = response.data.data.find(
          (p) => p.id === parseInt(postId),
        );
        if (foundPost) {
          setPost(foundPost);
        } else {
          setErrorMessage('존재하지 않는 게시글입니다.');
          setShowErrorModal(true);
        }
      }
    } catch (error) {
      console.error('게시글 불러오기 실패:', error);
      setErrorMessage('게시글을 불러오는 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/community-posts/comments/post/${postId}`,
      );

      if (response.data.error) {
        setErrorMessage(response.data.error);
        setShowErrorModal(true);
      } else {
        const commentsData = response.data.data || [];
        setComments(commentsData);
        if (commentsData.length > 0) {
          const anonymousMap = anonymizeUsers(commentsData);
          setUserMap(anonymousMap);
        }
      }
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
    }
  };

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
          post_id: parseInt(postId),
          user_id: userId,
          comment_content: newComment.trim(),
        },
      );

      if (response.data.error) {
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
          post_id: parseInt(postId),
          user_id: userId,
        },
      });

      if (response.data.error) {
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

  const getCategoryName = (category) => {
    return category === 1 ? '일반게시판' : '분실물게시판';
  };

  const getCategoryColor = () => {
    return 'text-[#788cff]';
  };

  const isUpdated = (createdAt, updatedAt) => {
    if (!Array.isArray(createdAt) || !Array.isArray(updatedAt)) return false;

    const createdTime = new Date(
      ...createdAt.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v)),
    ).getTime();
    const updatedTime = new Date(
      ...updatedAt.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v)),
    ).getTime();

    return Math.abs(updatedTime - createdTime) > 1000;
  };

  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <CommunityHeader title="게시글 상세" />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-[#73726e]">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <CommunityHeader title="게시글 상세" />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <p className="text-[#73726e] mb-2">게시글을 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CommunityHeader title="게시글 상세" />

      <main className="flex-1 p-4 pb-32">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
          <div className="p-6">
            <div
              className={`text-xs font-medium mb-3 ${getCategoryColor(post.category)}`}
            >
              {getCategoryName(post.category)}
            </div>

            <h1 className="text-lg font-bold text-[#37352f] mb-3 leading-relaxed">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#37352f]">
                  글쓴이
                </span>
                <span className="text-xs text-[#9b9998]">
                  {formatDate(
                    isUpdated(post.created_at, post.updated_at)
                      ? post.updated_at
                      : post.created_at,
                  )}
                  {isUpdated(post.created_at, post.updated_at) && ' (수정됨)'}
                </span>
              </div>

              {post.user_id === userId && (
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/community/${postId}/edit`)}
                    className="text-xs text-[#788cff] hover:text-[#6a7dff] transition-colors px-2 py-1"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="text-xs text-red-500 hover:text-red-600 transition-colors px-2 py-1"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            <div className="text-sm text-[#37352f] leading-relaxed whitespace-pre-wrap mb-6">
              {post.content}
            </div>

            <div className="text-sm font-medium text-[#37352f] mb-4">
              댓글 {comments.length}개
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
          {comments.length === 0 ? (
            <div className="p-6 text-center text-[#73726e]">
              아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {comments.map((comment) => (
                <div key={comment.id} className="px-6">
                  <CommentItem
                    comment={comment}
                    postId={parseInt(postId)}
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#788cff] focus:ring-2 focus:ring-[#788cff]/10 transition-all"
                disabled={isSubmittingComment}
                maxLength={500}
              />
              <button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || isSubmittingComment}
                className="px-6 py-3 bg-[#788cff] text-white rounded-lg hover:bg-[#6a7dff] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmittingComment ? '작성중...' : '등록'}
              </button>
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
