'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import BasicModal from '@components/common/basic-modal';
import FooterNav from '@components/common/FooterNav';
import { useUnsavedChangesGuard } from '@components/common/navigation-guard/navigation-guard-provider';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';
import Textarea from '@components/common/textarea';
import CommunityHeader from '@components/community/CommunityHeader';
import { Input } from '@components/common/input';

import axiosInstance from '@api/instance';

import useTokenStore from '../../../../stores/useTokenStore';

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
  const [initialValues, setInitialValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { accessToken, userId, rehydrate } = useTokenStore();
  const { postId } = useParams();
  const router = useRouter();

  const isDirty =
    initialValues !== null &&
    (title !== initialValues.title ||
      content !== initialValues.content ||
      category !== initialValues.category);
  const { markClean } = useUnsavedChangesGuard(isDirty);

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
          setInitialValues({
            title: found.title,
            content: found.content,
            category: found.category,
          });
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
    if (accessToken && postId) {
      fetchPost();
    }
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
      } else {
        markClean();
        router.push(`/community/${postId}`);
      }
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
    ) {
      router.push('/community');
    }
  };

  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-surface-muted flex flex-col">
        <CommunityHeader title="커뮤니티" />
        <BasicModal
          isOpen={showLoginModal}
          onClose={handleLoginConfirm}
          closeOnOverlayClick={false}
          className="max-w-modal-sm"
          title="로그인이 필요한 기능입니다"
          message="이 페이지를 이용하려면 로그인이 필요합니다."
          actions={[{ text: '확인', onClick: handleLoginConfirm }]}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-muted flex flex-col">
        <CommunityHeader title="커뮤니티" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col">
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
                  <div className="px-4 py-2 rounded-lg border text-sm border-gray-300 bg-white peer-checked:bg-brand/10 peer-checked:border-brand peer-checked:text-brand">
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
                  <div className="px-4 py-2 rounded-lg border text-sm border-gray-300 bg-white peer-checked:bg-brand/10 peer-checked:border-brand peer-checked:text-brand">
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
              <Input
                type="text"
                value={title}
                onChange={(value) => setTitle(value)}
                placeholder="제목을 입력하세요"
                disabled={isSubmitting}
                maxLength={100}
              />
              <div className="mt-1 text-right text-xs-plus text-gray-400">
                {title.length}/100
              </div>
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                내용
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                placeholder={`내용을 입력하세요...

참고사항:
- 서로를 존중하는 언어를 사용해주세요
- 개인정보나 연락처는 공유하지 마세요`}
                maxLength={1000}
                disabled={isSubmitting}
                className="bg-white"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="w-full py-3.5 rounded-lg text-white bg-brand hover:bg-brand-hover font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '게시글 수정 중…' : '수정 완료'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <BasicModal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        className="max-w-modal-sm"
        title="오류"
        message={errorMessage}
        actions={[{ text: '확인', onClick: handleErrorModalClose }]}
      />
      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav />
    </div>
  );
}
