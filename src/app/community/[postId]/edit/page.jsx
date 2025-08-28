'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useTokenStore from '../../../../stores/useTokenStore';
import axiosInstance from '../../../../libs/api/instance';
import CommunityHeader from '@components/community/CommunityHeader';
import LoginRequiredModal from '@components/common/LoginRequiredModal';
import Modal from '@components/common/Modal';
import Button from '@components/common/Button';
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

  useEffect(() => {
    if (accessToken && postId) {
      fetchPost();
    }
  }, [accessToken, postId]);

  const fetchPost = async () => {
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
          if (foundPost.user_id !== userId) {
            setErrorMessage('게시글 수정 권한이 없습니다.');
            setShowErrorModal(true);
            return;
          }
          setTitle(foundPost.title);
          setContent(foundPost.content);
          setCategory(foundPost.category);
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
      const response = await axiosInstance.put('/api/community-posts', {
        post_id: parseInt(postId),
        user_id: userId,
        title: title.trim(),
        content: content.trim(),
        category: category,
      });

      if (response.data.error) {
        setErrorMessage(response.data.error);
        setShowErrorModal(true);
      } else {
        router.push(`/community/${postId}`);
      }
    } catch (error) {
      console.error('게시글 수정 실패:', error);
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
    ) {
      router.push('/community');
    }
  };

  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <CommunityHeader title="게시글 수정" />
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
        <CommunityHeader title="게시글 수정" />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-[#73726e]">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CommunityHeader title="게시글 수정" />

      <main className="flex-1 p-4 pb-32">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#37352f] mb-3">
                카테고리
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={1}
                    checked={category === 1}
                    onChange={(e) => setCategory(parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <div
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      category === 1
                        ? 'bg-[#788cff] text-white border-[#788cff]'
                        : 'bg-white text-[#73726e] border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    일반게시판
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={2}
                    checked={category === 2}
                    onChange={(e) => setCategory(parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <div
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      category === 2
                        ? 'bg-[#ff8c78] text-white border-[#ff8c78]'
                        : 'bg-white text-[#73726e] border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    분실물게시판
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#37352f] mb-2">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#788cff] focus:ring-2 focus:ring-[#788cff]/10 transition-all"
                disabled={isSubmitting}
                maxLength={100}
              />
              <div className="text-xs text-[#9b9998] mt-1 text-right">
                {title.length}/100
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#37352f] mb-2">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                rows={10}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#788cff] focus:ring-2 focus:ring-[#788cff]/10 transition-all resize-none"
                disabled={isSubmitting}
                maxLength={1000}
              />
              <div className="text-xs text-[#9b9998] mt-1 text-right">
                {content.length}/1000
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                text={isSubmitting ? '수정 중...' : '게시글 수정'}
                className="w-full"
              />
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
