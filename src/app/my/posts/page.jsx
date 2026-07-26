'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import LoginRequiredModal from '@components/common/LoginRequiredModal';
import Modal from '@components/common/Modal';
import PostPreview from '@components/common/post-preview';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';
import MyPageHeader from '@components/my/MyPageHeader';

import axiosInstance from '@api/instance';

import FooterNav from '../../../components/common/FooterNav';
import useTokenStore from '../../../stores/useTokenStore';

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
          <h1 className="text-xl font-bold text-content mb-2">
            내가 작성한 글
          </h1>
          <p className="text-sm text-content-secondary">
            총 {posts.length}개의 게시글
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-content-secondary">로딩 중...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-content-secondary mb-4">
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
              className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors font-medium"
            >
              게시글 작성하기
            </button>
          </div>
        ) : (
          <ul className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
            {posts.map((post) => (
              <PostPreview key={post.id} {...post} />
            ))}
          </ul>
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
