'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import BasicModal from '@components/common/basic-modal';
import PostPreview from '@components/common/post-preview';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';
import MyPageHeader from '@components/my/MyPageHeader';

import { community } from '@api/keys/community.key';
import useRequireAuth from '@hooks/use-require-auth';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { isAuthenticated, requireLogin, redirectToLogin } = useRequireAuth();
  const router = useRouter();

  const {
    data,
    isPending: isLoading,
    error,
  } = useQuery({
    ...community.getMyList(),
    enabled: isAuthenticated,
    retry: false,
    staleTime: 0,
  });
  const posts = data?.error ? [] : (data?.data ?? []);

  useEffect(() => {
    if (error) {
      console.error('내 게시글 불러오기 실패:', error);
      setErrorMessage('게시글을 불러오는 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } else if (data?.error) {
      setErrorMessage(data.error);
      setShowErrorModal(true);
    }
  }, [data, error]);

  const handlePostClick = (postId) => {
    router.push(`/community/${postId}`);
  };

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray)) {
      return '';
    }
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

  const truncateContent = (content, maxLength = 80) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  };

  const isUpdated = (createdAt, updatedAt) => {
    if (!Array.isArray(createdAt) || !Array.isArray(updatedAt)) {
      return false;
    }

    const createdTime = new Date(
      ...createdAt.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v)),
    ).getTime();
    const updatedTime = new Date(
      ...updatedAt.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v)),
    ).getTime();

    return Math.abs(updatedTime - createdTime) > 1000;
  };

  if (requireLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <MyPageHeader />
        <BasicModal
          isOpen={requireLogin}
          onClose={redirectToLogin}
          closeOnOverlayClick={false}
          className="max-w-modal-sm"
          title="로그인이 필요한 기능입니다"
          message="이 페이지를 이용하려면 로그인이 필요합니다."
          actions={[{ text: '확인', onClick: redirectToLogin }]}
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

      <BasicModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        className="max-w-modal-sm"
        title="오류"
        message={errorMessage}
        actions={[{ text: '확인', onClick: () => setShowErrorModal(false) }]}
      />

      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav />
    </div>
  );
}
