'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../libs/api/instance';

function parseError(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    (typeof err?.response?.data === 'string' ? err.response.data : '') ||
    err?.message ||
    '요청 처리 중 오류가 발생했습니다.'
  );
}

function fmt(arr) {
  if (!Array.isArray(arr)) return '';
  const [y, mo, d, h = 0, m = 0] = arr;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(
    h,
  ).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * props:
 *  - suggestPostId: number
 *  - refreshKey?: number  // 바뀌면 재조회
 */
export default function AdminSuggestionComments({
  suggestPostId,
  refreshKey = 0,
}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosInstance.get('/api/suggestions/comments', {
        params: { suggest_post_id: Number(suggestPostId) },
      });
      const list = res?.data?.comments ?? res?.data ?? [];
      setComments(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(parseError(e));
    } finally {
      setLoading(false);
    }
  }, [suggestPostId]);

  useEffect(() => {
    if (suggestPostId) fetchComments();
  }, [suggestPostId, refreshKey, fetchComments]);

  return (
    <div className="rounded-lg border border-gray-100 p-3">
      {loading && (
        <p className="text-sm text-[var(--text-muted)]">불러오는 중...</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && comments.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">
          등록된 댓글이 없습니다.
        </p>
      )}

      {!loading && !error && comments.length > 0 && (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="text-sm">
              <div className="font-medium text-[var(--text-primary)]">
                {c.author ?? '사용자'}
              </div>

              {c.content && (
                <div className="text-[var(--text-secondary)] whitespace-pre-wrap">
                  {c.content}
                </div>
              )}

              {c.answer_content && (
                <div className="mt-2 rounded bg-[#f8f9ff] border px-3 py-2">
                  <div className="text-[var(--text-primary)] font-medium">
                    관리자 답변
                  </div>
                  <div className="text-[var(--text-secondary)] whitespace-pre-wrap">
                    {c.answer_content}
                  </div>
                </div>
              )}

              <div className="mt-1 text-xs text-gray-400">
                {fmt(
                  c.created_at || c.createdAt || c.answered_at || c.answeredAt,
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 text-right">
        <button
          type="button"
          onClick={fetchComments}
          className="px-2 py-1 text-xs rounded border"
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
