'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (accessToken && postId) {
      fetchPost();
    }
  }, [accessToken, postId, fetchPost]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex flex-col">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex flex-col">
        <CommunityHeader title="게시글 수정" />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#788cff] border-t-transparent"></div>
            <div className="text-[#73726e] font-medium">
              게시글을 불러오는 중...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex flex-col">
      <CommunityHeader title="게시글 수정" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-32">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#37352f]">
                  게시글 수정
                </h2>
                <p className="text-sm text-[#9b9998]">
                  기존 내용을 수정해보세요
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-gradient-to-r from-gray-50/50 to-transparent rounded-xl p-6 border border-gray-100/50">
                <label className="block text-sm font-semibold text-[#37352f] mb-4 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#788cff]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,2A3,3 0 0,1 15,5V7A3,3 0 0,1 12,10A3,3 0 0,1 9,7V5A3,3 0 0,1 12,2M12,4A1,1 0 0,0 11,5V7A1,1 0 0,0 12,8A1,1 0 0,0 13,7V5A1,1 0 0,0 12,4M21,12V14H18V12H21M16.5,17.25L18.36,19.11L17.61,19.86L15.75,18L16.5,17.25M7.5,17.25L8.25,18L6.39,19.86L5.64,19.11L7.5,17.25M6,14V12H3V14H6M12,23A1,1 0 0,1 11,22V20A1,1 0 0,1 12,19A1,1 0 0,1 13,20V22A1,1 0 0,1 12,23M19.5,3.5L20.25,4.25L18.36,6.11L17.61,5.36L19.5,3.5M4.5,3.5L6.36,5.36L5.61,6.11L3.75,4.25L4.5,3.5M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15Z" />
                  </svg>
                  카테고리
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={1}
                      checked={category === 1}
                      onChange={(e) => setCategory(parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div
                      className={`w-full sm:w-auto px-6 py-3 rounded-xl border-2 transition-all duration-200 group-hover:scale-105 touch-manipulation ${
                        category === 1
                          ? 'bg-gradient-to-r from-[#788cff] to-[#6a7dff] text-white border-[#788cff] shadow-lg'
                          : 'bg-white/70 text-[#73726e] border-gray-200/50 hover:border-[#788cff]/30 hover:bg-white/90'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V8H19V19Z" />
                        </svg>
                        일반게시판
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={2}
                      checked={category === 2}
                      onChange={(e) => setCategory(parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div
                      className={`w-full sm:w-auto px-6 py-3 rounded-xl border-2 transition-all duration-200 group-hover:scale-105 touch-manipulation ${
                        category === 2
                          ? 'bg-gradient-to-r from-[#ff8c78] to-[#ff7a66] text-white border-[#ff8c78] shadow-lg'
                          : 'bg-white/70 text-[#73726e] border-gray-200/50 hover:border-[#ff8c78]/30 hover:bg-white/90'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
                        </svg>
                        분실물게시판
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50/50 to-transparent rounded-xl p-6 border border-gray-100/50">
                <label className="block text-sm font-semibold text-[#37352f] mb-4 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#788cff]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5,3C3.89,3 3,3.89 3,5V19C3,20.11 3.89,21 5,21H19C20.11,21 21,20.11 21,19V5C21,3.89 20.11,3 19,3H5M5,5H19V19H5V5M7,7V9H17V7H7M7,11V13H17V11H7M7,15V17H14V15H7Z" />
                  </svg>
                  제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full px-5 py-4 border-2 border-gray-200/50 rounded-xl bg-white/70 focus:outline-none focus:border-[#788cff] focus:ring-4 focus:ring-[#788cff]/10 focus:bg-white transition-all duration-200 text-lg font-medium placeholder-gray-400"
                  disabled={isSubmitting}
                  maxLength={100}
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="text-xs text-[#9b9998]">
                    반드시 입력해주세요
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      title.length > 80 ? 'text-amber-600' : 'text-[#9b9998]'
                    }`}
                  >
                    {title.length}/100
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50/50 to-transparent rounded-xl p-6 border border-gray-100/50">
                <label className="block text-sm font-semibold text-[#37352f] mb-4 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#788cff]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  내용
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력하세요...

참고사항:
- 서로를 존중하는 언어를 사용해주세요
- 개인정보나 연락처는 공유하지 마세요"
                  rows={12}
                  className="w-full px-5 py-4 border-2 border-gray-200/50 rounded-xl bg-white/70 focus:outline-none focus:border-[#788cff] focus:ring-4 focus:ring-[#788cff]/10 focus:bg-white transition-all duration-200 resize-none placeholder-gray-400 leading-relaxed"
                  disabled={isSubmitting}
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="text-xs text-[#9b9998]">
                    반드시 입력해주세요
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      content.length > 800 ? 'text-amber-600' : 'text-[#9b9998]'
                    }`}
                  >
                    {content.length}/1000
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-orange-500 hover:to-red-500 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:scale-100"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      게시글 수정 중...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      수정 완료
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
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
