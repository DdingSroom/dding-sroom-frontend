'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useTokenStore from '../../../stores/useTokenStore';
import axiosInstance from '../../../libs/api/instance';
import MyPageHeader from '@components/common/MyPageHeader';
import LoginRequiredModal from '@components/common/LoginRequiredModal';
import Modal from '@components/common/Modal';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';
import FooterNav from '../../../components/common/FooterNav';

function BottomSafeSpacer({ height = 64 }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
    />
  );
}

export default function MyCommentsPage() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { accessToken, userId, rehydrate } = useTokenStore();
  const router = useRouter();

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  useEffect(() => {
    setShowLoginModal(!accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (accessToken && userId) {
      fetchMyComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, userId]);

  const fetchMyComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/community-posts/comments/user/${userId}`,
      );

      if (response.data.error) {
        setErrorMessage(response.data.error);
        setShowErrorModal(true);
      } else {
        setComments(response.data.data || []);
      }
    } catch (error) {
      console.error('내 댓글 불러오기 실패:', error);
      setErrorMessage('댓글을 불러오는 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginConfirm = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const handleCommentClick = (postId) => {
    router.push(`/community/${postId}`);
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

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <MyPageHeader />
        <LoginRequiredModal
          isOpen={showLoginModal}
          onConfirm={handleLoginConfirm}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MyPageHeader />

      <main className="flex-1 px-6 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#37352f] mb-2">
            내가 작성한 댓글
          </h1>
          <p className="text-sm text-[#73726e]">
            총 {comments.length}개의 댓글
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-[#73726e]">로딩 중...</div>
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-[#73726e] mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-base">아직 작성한 댓글이 없습니다.</p>
              <p className="text-sm mt-2">
                커뮤니티에서 다른 사람들과 소통해보세요!
              </p>
            </div>
            <button
              onClick={() => router.push('/community')}
              className="px-6 py-3 bg-[#788cff] text-white rounded-lg hover:bg-[#6a7dff] transition-colors font-medium"
            >
              커뮤니티 둘러보기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                onClick={() => handleCommentClick(comment.post_id)}
                className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-[#788cff]/20 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#788cff] bg-[#788cff]/10 px-3 py-1 rounded-full">
                      댓글
                    </span>
                    {comment.parent_comment_id && (
                      <span className="text-xs font-medium text-[#ff8c78] bg-[#ff8c78]/10 px-3 py-1 rounded-full">
                        답글
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#9b9998]">
                    {formatDate(comment.created_at)}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-[#37352f] leading-relaxed">
                    {truncateContent(comment.comment_content, 100)}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-[#9b9998]">
                    게시글에서 작성한 댓글 · 클릭하여 원문 보기
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
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
