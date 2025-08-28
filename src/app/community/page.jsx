'use client';

import { useEffect, useState } from 'react';
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
  }, [accessToken, activeCategory, fetchPosts]);

  const fetchPosts = async () => {
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

      if (response.data.error) {
        setErrorMessage(response.data.error);
        setShowErrorModal(true);
      } else {
        const postsData =
          activeCategory === 'all' ? response.data.data : response.data.posts;
        const sortedPosts = postsData.sort((a, b) => {
          const dateA = new Date(
            ...a.created_at.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v)),
          );
          const dateB = new Date(
            ...b.created_at.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v)),
          );
          return dateB - dateA;
        });
        setPosts(sortedPosts);
      }
    } catch (error) {
      console.error('게시글 목록 불러오기 실패:', error);
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

  const handleWritePost = () => {
    router.push('/community/write');
  };

  const categories = [
    { id: 'all', name: '전체글' },
    { id: 'general', name: '일반게시판' },
    { id: 'lost', name: '분실물게시판' },
  ];

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CommunityHeader />

      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex px-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-1 py-4 text-sm font-medium transition-all duration-300 border-b-2 ${
                activeCategory === category.id
                  ? 'text-[#788cff] border-[#788cff]'
                  : 'text-[#9b9998] border-transparent hover:text-[#73726e]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 p-4 pb-32">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-[#73726e]">로딩 중...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-[#73726e] mb-2">아직 게시글이 없습니다.</p>
              <p className="text-sm text-[#9b9998]">
                첫 번째 게시글을 작성해보세요!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-20 right-4">
        <button
          onClick={handleWritePost}
          className="w-14 h-14 bg-[#788cff] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6a7dff] transition-colors"
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
