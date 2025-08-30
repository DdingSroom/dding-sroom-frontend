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
    { id: 'general', name: '일반 게시판' },
    { id: 'lost', name: '분실물 게시판' },
  ];

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      let response;

      if (activeCategory === 'all') {
        response = await axiosInstance.get('/api/community-posts');
      } else {
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
      <div className="min-h-screen bg-[#f6f7f9] flex flex-col">
        <CommunityHeader showSearch />
        <LoginRequiredModal
          isOpen={showLoginModal}
          onConfirm={handleLoginConfirm}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] flex flex-col">
      <CommunityHeader showSearch />

      {/* 상단 카테고리 탭 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            {categories.map((category) => {
              const active = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative flex-1 py-3 text-sm md:text-base font-medium transition-colors
                    ${active ? 'text-[#4c6fff]' : 'text-gray-500 hover:text-gray-700'}`}
                  role="tab"
                  aria-pressed={active}
                >
                  {category.name}
                  <span
                    className={`absolute left-0 right-0 -bottom-px h-[2px] 
                    ${active ? 'bg-[#4c6fff]' : 'bg-transparent'}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 pb-28">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#4c6fff] border-t-transparent" />
              <div className="text-gray-600 text-sm">
                게시글을 불러오는 중...
              </div>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center bg-white rounded-2xl p-10 border border-gray-200 shadow-sm max-w-md">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-[#4c6fff]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="text-gray-800 font-semibold mb-1">
                아직 게시글이 없습니다
              </p>
              <p className="text-sm text-gray-500 mb-5">
                첫 번째 게시글을 작성해보세요!
              </p>
              <button
                onClick={handleWritePost}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4c6fff] text-white text-sm font-semibold rounded-lg hover:bg-[#3f58e6] transition-shadow shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                글 작성하기
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-800">
                전체 게시글{' '}
                <span className="text-[#4c6fff]">{posts.length}</span>개
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-24 md:bottom-8 z-50">
        <div className="pointer-events-auto max-w-4xl mx-auto px-4 flex justify-end">
          <button
            onClick={handleWritePost}
            aria-label="새 글 작성"
            className="w-14 h-14 rounded-full bg-[#788DFF] text-white shadow-lg hover:shadow-xl transition-transform active:scale-95 flex items-center justify-center"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
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
