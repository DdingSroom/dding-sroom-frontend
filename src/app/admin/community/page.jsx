'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../../libs/api/instance';
import useTokenStore from '../../../stores/useTokenStore';

export default function AdminCommunityPage() {
  const router = useRouter();
  const { accessToken } = useTokenStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [openPostIds, setOpenPostIds] = useState(new Set());
  const [commentsData, setCommentsData] = useState({});
  const [loadingComments, setLoadingComments] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }
    try {
      const decoded = jwtDecode(accessToken);
      if (decoded.role !== 'ROLE_ADMIN') {
        router.push('/admin/login');
        return;
      }
    } catch (e) {
      console.error('토큰 디코드 오류:', e);
      router.push('/admin/login');
    }
  }, [accessToken, router]);

  const fetchPosts = useCallback(
    async (page = 0, size = pageSize) => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/api/community-posts', {
          params: { page, size },
        });

        const data = response?.data?.data || response?.data || [];
        const postsArray = data.posts || data.content || data || [];

        setPosts(postsArray.map(normalizePost));
        setTotalPages(
          data.totalPages ||
            Math.ceil((data.totalElements || postsArray.length) / size),
        );
      } catch (err) {
        console.error('게시글 목록 불러오기 실패:', err);
        setError(parseError(err));
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  const fetchCommentsByPost = useCallback(async (postId) => {
    try {
      const response = await axiosInstance.get(
        `/api/community-posts/comments/post/${postId}`,
      );
      const comments = response?.data?.data || response?.data || [];
      return Array.isArray(comments) ? comments.map(normalizeComment) : [];
    } catch (err) {
      console.error(`게시글 ${postId} 댓글 불러오기 실패:`, err);
      return [];
    }
  }, []);

  const fetchRepliesByComment = useCallback(async (commentId) => {
    try {
      const response = await axiosInstance.get(
        `/api/community-posts/comments/${commentId}/replies`,
      );
      const replies = response?.data?.data || response?.data || [];
      return Array.isArray(replies) ? replies.map(normalizeComment) : [];
    } catch (err) {
      console.error(`댓글 ${commentId} 대댓글 불러오기 실패:`, err);
      return [];
    }
  }, []);

  const togglePostOpen = useCallback(
    async (postId) => {
      const isOpen = openPostIds.has(postId);

      if (isOpen) {
        setOpenPostIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        return;
      }

      if (commentsData[postId]) {
        setOpenPostIds((prev) => new Set([...prev, postId]));
        return;
      }

      setLoadingComments((prev) => new Set([...prev, postId]));

      try {
        const comments = await fetchCommentsByPost(postId);

        const repliesPromises = comments.map((comment) =>
          fetchRepliesByComment(comment.id).then((replies) => ({
            commentId: comment.id,
            replies,
          })),
        );

        const batchSize = 10;
        const repliesResults = [];
        for (let i = 0; i < repliesPromises.length; i += batchSize) {
          const batch = repliesPromises.slice(i, i + batchSize);
          const batchResults = await Promise.all(batch);
          repliesResults.push(...batchResults);
        }

        const repliesMap = {};
        repliesResults.forEach(({ commentId, replies }) => {
          repliesMap[commentId] = replies;
        });

        const commentsWithReplies = comments.map((comment) => ({
          ...comment,
          replies: repliesMap[comment.id] || [],
        }));

        setCommentsData((prev) => ({
          ...prev,
          [postId]: commentsWithReplies,
        }));

        setOpenPostIds((prev) => new Set([...prev, postId]));
      } catch (err) {
        console.error(`게시글 ${postId} 댓글 로드 실패:`, err);
        alert('댓글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoadingComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
    },
    [openPostIds, commentsData, fetchCommentsByPost, fetchRepliesByComment],
  );

  useEffect(() => {
    fetchPosts(currentPage);
  }, [fetchPosts, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-[#F1F2F4] p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-lg font-semibold mb-4">커뮤니티 게시글</h1>

        {loading && <p>로딩 중...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && posts.length === 0 && (
          <p className="text-sm text-gray-500">표시할 게시글이 없습니다.</p>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium">ID</th>
                    <th className="text-left px-4 py-3 font-medium">제목</th>
                    <th className="text-left px-4 py-3 font-medium">작성자</th>
                    <th className="text-left px-4 py-3 font-medium">작성일</th>
                    <th className="text-left px-4 py-3 font-medium">댓글 수</th>
                    <th className="text-left px-4 py-3 font-medium">동작</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <React.Fragment key={post.id}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">#{post.id}</td>
                        <td className="px-4 py-3 max-w-xs truncate">
                          {post.title}
                        </td>
                        <td className="px-4 py-3">{post.author}</td>
                        <td className="px-4 py-3">
                          {formatDate(post.createdAt)}
                        </td>
                        <td className="px-4 py-3">{post.commentCount || 0}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => togglePostOpen(post.id)}
                            disabled={loadingComments.has(post.id)}
                            className="px-3 py-1.5 text-sm rounded bg-gray-50 hover:bg-gray-100 border disabled:opacity-50"
                          >
                            {loadingComments.has(post.id)
                              ? '로딩...'
                              : openPostIds.has(post.id)
                                ? '접기'
                                : '보기'}
                          </button>
                        </td>
                      </tr>

                      {openPostIds.has(post.id) && (
                        <tr>
                          <td colSpan="6" className="px-4 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <h4 className="font-medium text-gray-800">
                                댓글 목록
                              </h4>
                              {commentsData[post.id] &&
                              commentsData[post.id].length > 0 ? (
                                <div className="space-y-3">
                                  {commentsData[post.id].map((comment) => (
                                    <div
                                      key={comment.id}
                                      className="bg-white p-3 rounded border"
                                    >
                                      <div className="text-sm text-gray-800">
                                        {comment.content}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {comment.author} ·{' '}
                                        {formatDate(comment.createdAt)}
                                      </div>

                                      {comment.replies &&
                                        comment.replies.length > 0 && (
                                          <div className="ml-6 mt-3 space-y-2">
                                            {comment.replies.map((reply) => (
                                              <div
                                                key={reply.id}
                                                className="bg-gray-50 p-2 rounded border-l-2 border-gray-300"
                                              >
                                                <div className="text-sm text-gray-700">
                                                  {reply.content}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                  {reply.author} ·{' '}
                                                  {formatDate(reply.createdAt)}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  댓글이 없습니다.
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <span className="px-3 py-2 text-sm">
                  {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function normalizePost(raw) {
  return {
    id: raw?.id ?? raw?.post_id ?? raw?.postId,
    title: raw?.title ?? raw?.post_title ?? '(제목 없음)',
    author: raw?.author ?? raw?.user_name ?? raw?.userName ?? '익명',
    content: raw?.content ?? raw?.post_content ?? '',
    createdAt: raw?.createdAt ?? raw?.created_at ?? raw?.created_date ?? [],
    commentCount: raw?.comment_count ?? raw?.commentCount ?? 0,
  };
}

function normalizeComment(raw) {
  return {
    id: raw?.id ?? raw?.comment_id ?? raw?.commentId,
    content: raw?.content ?? raw?.comment_content ?? '',
    author: raw?.author ?? raw?.user_name ?? raw?.userName ?? '익명',
    createdAt: raw?.createdAt ?? raw?.created_at ?? raw?.created_date ?? [],
    replies: [],
  };
}

function parseError(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    (typeof err?.response?.data === 'string' ? err.response.data : '') ||
    err?.message ||
    '요청 처리 중 오류가 발생했습니다.'
  );
}

function formatDate(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return '';
  const [year, month, day, hour = 0, minute = 0] = dateArray;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
