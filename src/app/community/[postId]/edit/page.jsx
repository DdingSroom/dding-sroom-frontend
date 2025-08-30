'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useTokenStore from '../../../../stores/useTokenStore';
import axiosInstance from '../../../../libs/api/instance';
import CommunityHeader from '@components/community/CommunityHeader';
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

export default function EditPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const fetchPost = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/api/community-posts');
      if (res.data.error) {
        setErrorMessage(res.data.error);
        setShowErrorModal(true);
      } else {
        const found = res.data.data.find((p) => p.id === parseInt(postId));
        if (!found) {
          setErrorMessage('존재하지 않는 게시글입니다.');
          setShowErrorModal(true);
        } else if (found.user_id !== userId) {
          setErrorMessage('게시글 수정 권한이 없습니다.');
          setShowErrorModal(true);
        } else {
          setTitle(found.title);
          setContent(found.content);
          setCategory(found.category);
        }
      }
    } catch (e) {
      console.error('게시글 불러오기 실패:', e);
      setErrorMessage('게시글을 불러오는 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  }, [postId, userId]);

  useEffect(() => {
    if (accessToken && postId) fetchPost();
  }, [accessToken, postId, fetchPost]);

  const handleLoginConfirm = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('제목을 입력해주세요.');
      setShowErrorModal(true);
      return;
    }
    if (!content.trim()) {
      setErrorMessage('내용을 입력해주세요.');
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.put('/api/community-posts', {
        post_id: parseInt(postId),
        user_id: userId,
        title: title.trim(),
        content: content.trim(),
        category,
      });
      if (res.data.error) {
        setErrorMessage(res.data.error);
        setShowErrorModal(true);
      } else router.push(`/community/${postId}`);
    } catch (e) {
      console.error('게시글 수정 실패:', e);
      setErrorMessage('게시글 수정 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    if (
      errorMessage.includes('권한이 없습니다') ||
      errorMessage.includes('존재하지 않는')
    )
      router.push('/community');
  };

  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-[#f6f7f9] flex flex-col">
        <CommunityHeader title="커뮤니티" />
        <LoginRequiredModal
          isOpen={showLoginModal}
          onConfirm={handleLoginConfirm}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f7f9] flex flex-col">
        <CommunityHeader title="커뮤니티" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#788DFF] border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] flex flex-col">
      <CommunityHeader title="커뮤니티" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 pb-28">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                카테고리
              </label>
              <div className="flex gap-3">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={1}
                    checked={category === 1}
                    onChange={(e) => setCategory(parseInt(e.target.value))}
                    className="peer sr-only"
                  />
                  <div className="px-4 py-2 rounded-lg border text-sm border-gray-300 bg-white peer-checked:bg-[#788DFF]/10 peer-checked:border-[#788DFF] peer-checked:text-[#788DFF]">
                    일반 게시판
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={2}
                    checked={category === 2}
                    onChange={(e) => setCategory(parseInt(e.target.value))}
                    className="peer sr-only"
                  />
                  <div className="px-4 py-2 rounded-lg border text-sm border-gray-300 bg-white peer-checked:bg-[#788DFF]/10 peer-checked:border-[#788DFF] peer-checked:text-[#788DFF]">
                    분실물 게시판
                  </div>
                </label>
              </div>
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#788DFF] focus:ring-2 focus:ring-[#788DFF]/15 text-[15px]"
                disabled={isSubmitting}
                maxLength={100}
              />
              <div className="mt-1 text-right text-[11px] text-gray-400">
                {title.length}/100
              </div>
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                placeholder={`내용을 입력하세요...

참고사항:
- 서로를 존중하는 언어를 사용해주세요
- 개인정보나 연락처는 공유하지 마세요`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#788DFF] focus:ring-2 focus:ring-[#788DFF]/15 text-[15px] leading-relaxed"
                disabled={isSubmitting}
                maxLength={1000}
              />
              <div className="mt-1 text-right text-[11px] text-gray-400">
                {content.length}/1000
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="w-full py-3.5 rounded-lg text-white bg-[#788DFF] hover:bg-[#6177ff] font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '게시글 수정 중…' : '수정 완료'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Modal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
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
