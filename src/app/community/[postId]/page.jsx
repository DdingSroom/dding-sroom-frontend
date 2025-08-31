'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useTokenStore from '../../../stores/useTokenStore';
import axiosInstance from '../../../libs/api/instance';
import { anonymizeUsers } from '../../../utils/anonymizeUser';
import CommunityHeader from '@components/community/CommunityHeader';
import CommentItem from '@components/community/CommentItem';
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

export default function PostDetailPage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userMap, setUserMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
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

  const fetchPostDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/api/community-posts');
      if (res?.data?.error) {
        setErrorMessage(res.data.error);
        setShowErrorModal(true);
        return;
      }
      const found = (res?.data?.data ?? []).find(
        (p) => p.id === parseInt(postId, 10),
      );
      if (found) setPost(found);
      else {
        setErrorMessage('존재하지 않는 게시글입니다.');
        setShowErrorModal(true);
      }
    } catch (e) {
      console.error('게시글 불러오기 실패:', e);
      setErrorMessage('게시글을 불러오는 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        `/api/community-posts/comments/post/${postId}`,
      );
      if (res?.data?.error) {
        setErrorMessage(res.data.error);
        setShowErrorModal(true);
        return;
      }
      const list = res?.data?.data ?? [];
      setComments(list);
      if (list.length > 0) setUserMap(anonymizeUsers(list));
    } catch (e) {
      console.error('댓글 불러오기 실패:', e);
    }
  }, [postId]);

  useEffect(() => {
    if (accessToken && postId) {
      fetchPostDetail();
      fetchComments();
    }
  }, [accessToken, postId, fetchPostDetail, fetchComments]);

  const handleLoginConfirm = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      const res = await axiosInstance.post('/api/community-posts/comments', {
        post_id: parseInt(postId, 10),
        user_id: userId,
        comment_content: newComment.trim(),
      });
      if (res?.data?.error) {
        setErrorMessage(res.data.error);
        setShowErrorModal(true);
      } else {
        setNewComment('');
        fetchComments();
      }
    } catch (e) {
      console.error('댓글 작성 실패:', e);
      setErrorMessage('댓글 작성 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
    try {
      const res = await axiosInstance.delete('/api/community-posts', {
        data: { post_id: parseInt(postId, 10), user_id: userId },
      });
      if (res?.data?.error) {
        setErrorMessage(res.data.error);
        setShowErrorModal(true);
      } else router.push('/community');
    } catch (e) {
      console.error('게시글 삭제 실패:', e);
      setErrorMessage('게시글 삭제 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    }
  };

  const formatDate = (arr) => {
    if (!Array.isArray(arr)) return '';
    const [y, m, d, h, min] = arr;
    const date = new Date(y, (m || 1) - 1, d || 1, h || 0, min || 0);
    const now = new Date();
    const diff = now - date;
    const hrs = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);
    if (hrs < 24)
      return hrs < 1
        ? `${Math.floor(diff / (1000 * 60))}분 전`
        : `${Math.floor(hrs)}시간 전`;
    if (days < 30) return `${Math.floor(days)}일 전`;
    return `${y}.${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`;
  };

  const getCategoryName = (c) => (c === 1 ? '일반 게시판' : '분실물 게시판');
  const isUpdated = (createdAt, updatedAt) => {
    if (!Array.isArray(createdAt) || !Array.isArray(updatedAt)) return false;
    const ts = (a) =>
      new Date(...a.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v))).getTime();
    return Math.abs(ts(updatedAt) - ts(createdAt)) > 1000;
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
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin h-8 w-8 rounded-full border-2 border-[#788DFF] border-top-transparent" />
            <div className="text-sm text-gray-600">게시글을 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f6f7f9] flex flex-col">
        <CommunityHeader title="커뮤니티" />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
            <p className="text-gray-700 font-semibold mb-1">
              게시글을 찾을 수 없습니다
            </p>
            <p className="text-sm text-gray-500">
              삭제되었거나 존재하지 않는 게시글입니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] flex flex-col">
      <CommunityHeader title="커뮤니티" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 pb-28">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
          <div className="px-5 py-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-[#788DFF]">
                {getCategoryName(post.category)}
              </span>
              <span className="text-[11px] text-gray-400">
                {formatDate(
                  isUpdated(post.created_at, post.updated_at)
                    ? post.updated_at
                    : post.created_at,
                )}
              </span>
              {isUpdated(post.created_at, post.updated_at) && (
                <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  수정됨
                </span>
              )}
            </div>

            <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-relaxed mb-2">
              {post.title}
            </h1>
            <div className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            {post.user_id === userId && (
              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => router.push(`/community/${postId}/edit`)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  수정
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-3 py-1.5 text-xs rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">댓글</span>
            <span className="ml-1 text-xs font-semibold text-[#788DFF] bg-[#788DFF]/10 rounded-full px-2 py-0.5">
              {comments.length}
            </span>
          </div>

          {comments.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-500">
              아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {comments.map((c) => (
                <div key={c.id} className="px-5">
                  <CommentItem
                    comment={c}
                    postId={parseInt(postId, 10)}
                    postAuthorId={post.user_id}
                    onCommentUpdate={fetchComments}
                    onError={(m) => {
                      setErrorMessage(m);
                      setShowErrorModal(true);
                    }}
                    userMap={userMap}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="px-5 py-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요…"
                className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#788DFF] focus:ring-2 focus:ring-[#788DFF]/15"
                disabled={isSubmittingComment}
                maxLength={500}
              />
              <button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || isSubmittingComment}
                className="px-4 py-3 text-sm font-semibold text-white bg-[#788DFF] rounded-lg hover:bg-[#6177ff] disabled:bg-gray-300"
              >
                {isSubmittingComment ? '작성중…' : '등록'}
              </button>
            </div>
            <div className="mt-1 text-right text-[11px] text-gray-400">
              {newComment.length}/500
            </div>
          </div>
        </div>
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
