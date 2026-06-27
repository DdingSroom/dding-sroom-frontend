'use client';

import React, { useState } from 'react';

import ConfirmModal from '@components/common/ConfirmModal';

import axiosInstance from '@api/instance';
import { useUnsavedChangesConfirm } from '@hooks/useUnsavedChangesConfirm';

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

  const isDirty = value.trim() !== '';
  const { showConfirm, confirmLeave, cancelLeave, markClean } =
    useUnsavedChangesConfirm(isDirty);

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
      markClean();
      setValue('');
      if (typeof onUpdate === 'function') {
        onUpdate();
      }
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
        className="w-full rounded-lg border border-line bg-surface-subtle px-3 py-2 text-sm"
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
            submitting ? 'bg-brand-disabled cursor-not-allowed' : 'bg-brand'
          }`}
        >
          {submitting ? '등록 중...' : '답변 등록'}
        </button>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={cancelLeave}
        onConfirm={confirmLeave}
        title="작성 중인 내용이 있습니다"
        message="페이지를 나가면 작성 중인 내용이 사라질 수 있습니다. 정말 나가시겠습니까?"
        cancelText="계속 작성하기"
        confirmText="나가기"
      />
    </div>
  );
}
