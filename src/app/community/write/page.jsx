'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useTokenStore from '../../../stores/useTokenStore';
import axiosInstance from '../../../libs/api/instance';
import CommunityHeader from '@components/community/CommunityHeader';
import LoginRequiredModal from '@components/common/LoginRequiredModal';
import Modal from '@components/common/Modal';
import Button from '@components/common/Button';

export default function WritePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const response = await axiosInstance.post('/api/community-posts', {
        user_id: userId,
        title: title.trim(),
        content: content.trim(),
        category: category,
      });

      if (response.data.error) {
        setErrorMessage(response.data.error);
        setShowErrorModal(true);
      } else {
        router.push('/community');
      }
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      setErrorMessage('게시글 작성 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <CommunityHeader title="게시글 작성" />
        <LoginRequiredModal
          isOpen={showLoginModal}
          onConfirm={handleLoginConfirm}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CommunityHeader title="게시글 작성" />

      <main className="flex-1 p-4">
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
                text={isSubmitting ? '작성 중...' : '게시글 작성'}
                className="w-full"
              />
            </div>
          </form>
        </div>
      </main>

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="오류"
        content={errorMessage}
        showCancel={false}
      />
    </div>
  );
}
