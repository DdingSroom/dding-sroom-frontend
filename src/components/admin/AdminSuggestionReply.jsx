'use client';

import React, { useState } from 'react';
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

/**
 * props:
 *  - suggestion: { id, ... }
 *  - onUpdate: () => void   (등록 성공 후 목록/댓글 새로고침용)
 */
export default function AdminSuggestionReply({ suggestion, onUpdate }) {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!value.trim()) {
      setError('답변 내용을 입력해 주세요.');
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post('/api/suggestions/comments', {
        suggest_post_id: Number(suggestion?.id),
        answer_content: value.trim(),
      });
      setValue('');
      if (typeof onUpdate === 'function') onUpdate();
    } catch (e) {
      setError(parseError(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-2">관리자 답변</h4>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        placeholder="관리자 답변을 입력해 주세요."
        className="w-full rounded-lg border border-[var(--border-light)] bg-[#fbfbfb] px-3 py-2 text-sm"
      />

      <div className="mt-2 flex items-center justify-between">
        {error ? (
          <span className="text-xs text-red-500">{error}</span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className={`px-3 py-1.5 text-sm rounded text-white ${
            submitting
              ? 'bg-[#bfc8ff] cursor-not-allowed'
              : 'bg-[var(--primary-color)]'
          }`}
        >
          {submitting ? '등록 중...' : '답변 등록'}
        </button>
      </div>
    </div>
  );
}
