'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useTokenStore from '../../stores/useTokenStore';
import axiosInstance from '../../libs/api/instance';
import CommunityHeader from '@components/community/CommunityHeader';
import PostCard from '@components/community/PostCard';
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

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const { accessToken, rehydrate } = useTokenStore();
  const router = useRouter();

  const categories = [
    { id: 'all', name: '전체글' },
    { id: 'general', name: '일반게시판' },
    { id: 'lost', name: '분실물게시판' },
  ];

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      let response;

      if (activeCategory === 'all') {
        response = await axiosInstance.get('/api/community-posts');
      } else {
        // 일반:1, 분실물:2
        const categoryNum = activeCategory === 'general' ? 1 : 2;
        response = await axiosInstance.get(
          `/api/community-posts/search?category=${categoryNum}`,
        );
      }

      if (response?.data?.error) {
        setErrorMessage(response.data.error);
        setShowErrorModal(true);
        return;
      }

      const postsData =
        activeCategory === 'all' ? response?.data?.data : response?.data?.posts;

      const sortedPosts = (postsData ?? []).slice().sort((a, b) => {
        const toDate = (arr) =>
          new Date(...arr.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v)));
        return toDate(b.created_at) - toDate(a.created_at);
      });

      setPosts(sortedPosts);
    } catch (error) {
      console.error('게시글 목록 불러오기 실패:', error);
      setErrorMessage('게시글을 불러오는 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  useEffect(() => {
    setShowLoginModal(!accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchPosts();
    }
  }, [accessToken, fetchPosts]);

  const handleLoginConfirm = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const handleWritePost = () => {
    router.push('/community/write');
  };

  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <CommunityHeader />
        <LoginRequiredModal
          isOpen={showLoginModal}
          onConfirm={handleLoginConfirm}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex flex-col">
      <CommunityHeader />

      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative flex-1 py-4 text-sm md:text-base font-semibold transition-all duration-300 border-b-2 group touch-manipulation ${
                  activeCategory === category.id
                    ? 'text-[#788cff] border-[#788cff]'
                    : 'text-[#9b9998] border-transparent hover:text-[#73726e] hover:border-gray-300'
                }`}
                aria-pressed={activeCategory === category.id}
                role="tab"
              >
                <span className="relative z-10">{category.name}</span>
                {activeCategory === category.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#788cff]/5 to-transparent rounded-t-lg" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-32">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#788cff] border-t-transparent"></div>
              <div className="text-[#73726e] font-medium">
                게시글을 불러오는 중...
              </div>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 shadow-sm max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-[#788cff]/10 to-[#ff8c78]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#788cff]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="text-[#37352f] font-semibold mb-2">
                아직 게시글이 없습니다
              </p>
              <p className="text-sm text-[#9b9998] mb-6">
                첫 번째 게시글을 작성해보세요!
              </p>
              <button
                onClick={handleWritePost}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#788cff] text-white text-sm font-semibold rounded-xl hover:bg-[#6a7dff] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                글 작성하기
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#37352f] mb-2">
                전체 게시글 {posts.length}개
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-[#788cff] to-[#6a7dff] rounded-full"></div>
            </div>
            <div className="grid gap-4 md:gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50">
        <button
          onClick={handleWritePost}
          className="w-14 h-14 bg-[#788cff] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6a7dff] transition-all duration-200 hover:scale-105"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

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
