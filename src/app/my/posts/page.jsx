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

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
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
      fetchMyPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, userId]);

  const fetchMyPosts = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/community-posts/user/${userId}`,
      );

      if (response.data.error) {
        setErrorMessage(response.data.error);
        setShowErrorModal(true);
      } else {
        setPosts(response.data.data || []);
      }
    } catch (error) {
      console.error('내 게시글 불러오기 실패:', error);
      setErrorMessage('게시글을 불러오는 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginConfirm = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const handlePostClick = (postId) => {
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

  const getCategoryName = (category) => {
    return category === 1 ? '일반게시판' : '분실물게시판';
  };

  const truncateContent = (content, maxLength = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
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
            내가 작성한 글
          </h1>
          <p className="text-sm text-[#73726e]">총 {posts.length}개의 게시글</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-[#73726e]">로딩 중...</div>
          </div>
        ) : posts.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-base">아직 작성한 게시글이 없습니다.</p>
              <p className="text-sm mt-2">
                커뮤니티에서 첫 게시글을 작성해보세요!
              </p>
            </div>
            <button
              onClick={() => router.push('/community/write')}
              className="px-6 py-3 bg-[#788cff] text-white rounded-lg hover:bg-[#6a7dff] transition-colors font-medium"
            >
              게시글 작성하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-[#788cff]/20 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-[#788cff] bg-[#788cff]/10 group-hover:bg-[#788cff]/15 transition-colors">
                    {getCategoryName(post.category)}
                  </div>
                  <div className="text-xs text-[#9b9998]">
                    {formatDate(
                      isUpdated(post.created_at, post.updated_at)
                        ? post.updated_at
                        : post.created_at,
                    )}
                    {isUpdated(post.created_at, post.updated_at) && ' (수정됨)'}
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#37352f] mb-2 leading-relaxed group-hover:text-[#788cff] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-[#73726e] leading-relaxed line-clamp-2">
                  {truncateContent(post.content, 80)}
                </p>
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
