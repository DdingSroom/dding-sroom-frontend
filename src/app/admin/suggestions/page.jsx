'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../../libs/api/instance';
import useTokenStore from '../../../stores/useTokenStore';
import SuggestionImagesByUrl from '../../../components/admin/SuggestionImagesByUrl';
import AdminSuggestionComments from '../../../components/admin/AdminSuggestionComments';
import AdminSuggestionReply from '../../../components/admin/AdminSuggestionReply';

export default function AdminSuggestionsPage() {
  const router = useRouter();
  const { accessToken } = useTokenStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grouped, setGrouped] = useState({});
  const [sortedDates, setSortedDates] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    is_answered: '',
    user_id: '',
    suggest_id: '',
  });

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

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.suggest_id)
      params.set('suggest_id', String(filters.suggest_id));
    if (filters.user_id) params.set('user_id', String(filters.user_id));
    if (filters.category) params.set('category', filters.category);
    if (filters.location) params.set('location', filters.location);
    if (filters.is_answered === 'true' || filters.is_answered === 'false') {
      params.set('is_answered', filters.is_answered);
    }
    const qs = params.toString();
    return qs ? `/api/suggestions?${qs}` : '/api/suggestions';
  }, [filters]);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const url = buildQuery();
      const res = await axiosInstance.get(url);
      const suggestions = (res?.data?.suggestions ?? res?.data ?? []).map(
        safeNormalizeSuggestion,
      );

      const bucket = {};
      for (const s of suggestions) {
        const key = formatDateOnly(s.createdAt);
        if (!bucket[key]) bucket[key] = [];
        bucket[key].push(s);
      }
      Object.keys(bucket).forEach((k) => {
        bucket[k].sort((a, b) => tsDesc(b.createdAt, a.createdAt));
      });
      const keys = Object.keys(bucket).sort(
        (a, b) => new Date(b) - new Date(a),
      );

      setGrouped(bucket);
      setSortedDates(keys);
    } catch (err) {
      console.error('건의/신고 목록 불러오기 실패:', err);
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return (
    <div className="bg-[#F1F2F4] p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-lg font-semibold mb-4">건의/신고 목록</h1>

        <Filters
          filters={filters}
          setFilters={setFilters}
          onSearch={fetchSuggestions}
        />

        {loading && <p>로딩 중...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && sortedDates.length === 0 && (
          <p className="text-sm text-gray-500">표시할 건의/신고가 없습니다.</p>
        )}

        {!loading &&
          !error &&
          sortedDates.map((date) => (
            <section key={date} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-block w-1.5 h-5 rounded"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                />
                <h2 className="text-sm font-bold text-gray-800">
                  {date} 접수 내역
                </h2>
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                />
              </div>

              <div className="grid gap-4">
                {grouped[date].map((item) => (
                  <SuggestionCard
                    key={item.id}
                    item={item}
                    onRefresh={fetchSuggestions}
                  />
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}

function Filters({ filters, setFilters, onSearch }) {
  const onChange = (k) => (e) =>
    setFilters((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-2 items-stretch">
      <input
        className="border rounded px-3 py-2 text-sm"
        placeholder="suggest_id"
        value={filters.suggest_id}
        onChange={onChange('suggest_id')}
      />
      <input
        className="border rounded px-3 py-2 text-sm"
        placeholder="user_id"
        value={filters.user_id}
        onChange={onChange('user_id')}
      />
      <input
        className="border rounded px-3 py-2 text-sm"
        placeholder="category"
        value={filters.category}
        onChange={onChange('category')}
      />
      <input
        className="border rounded px-3 py-2 text-sm"
        placeholder="location"
        value={filters.location}
        onChange={onChange('location')}
      />
      <select
        className="border rounded px-3 py-2 text-sm"
        value={filters.is_answered}
        onChange={onChange('is_answered')}
      >
        <option value="">전체(답변 여부)</option>
        <option value="false">미답변만</option>
        <option value="true">답변완료만</option>
      </select>

      <div className="flex md:justify-end">
        <button
          className="px-4 py-2 text-sm rounded text-white border"
          style={{
            backgroundColor: 'var(--primary-color)',
            borderColor: 'var(--primary-color)',
          }}
          onClick={onSearch}
        >
          검색
        </button>
      </div>
    </div>
  );
}

function SuggestionCard({ item, onRefresh }) {
  const [open, setOpen] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const toggle = () => setOpen(!open);

  const handleAnswered = () => {
    if (typeof onRefresh === 'function') onRefresh();
    setRefreshTick((t) => t + 1);
  };

  return (
    <article
      className={`relative rounded-xl border bg-white shadow-sm overflow-hidden transition ${
        open ? 'border-[var(--primary-color)]' : 'hover:shadow-md'
      }`}
    >
      <div
        className="h-1"
        style={{ backgroundColor: 'var(--primary-color)' }}
      />

      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] rounded bg-gray-100 text-gray-700">
                #{item.id}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] rounded bg-gray-50 text-gray-700">
                {item.category || '카테고리 없음'}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] rounded bg-gray-50 text-gray-700">
                {item.location || '위치 미상'}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 text-[11px] rounded ${
                  item.isAnswered
                    ? 'bg-green-50 text-green-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {item.isAnswered ? '답변 완료' : '미답변'}
              </span>
            </div>

            <h3 className="mt-2 font-medium text-sm text-gray-900 break-all">
              {item.title || '(제목 없음)'}
            </h3>
            <p className="mt-1 text-sm text-gray-600 break-words line-clamp-2">
              {item.content}
            </p>

            <p className="mt-2 text-[11px] text-gray-400">
              작성자: {item.userId ?? '알수없음'} ·{' '}
              {formatFullDate(item.createdAt)}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={toggle}
              className="px-3 py-1.5 text-sm rounded bg-gray-50 hover:bg-gray-100 border"
            >
              {open ? '접기' : '자세히'}
            </button>
          </div>
        </div>

        {open && (
          <div
            className="my-3 border-t border-dashed"
            style={{ borderColor: 'var(--primary-color)' }}
          />
        )}

        {open && (
          <div className="space-y-4">
            <section aria-label="본문">
              <p className="text-sm whitespace-pre-wrap break-words">
                {item.content}
              </p>
            </section>

            <section aria-label="첨부 이미지">
              <h4 className="text-sm font-semibold mb-2">첨부 이미지</h4>
              <SuggestionImagesByUrl
                suggestPostId={item.id}
                className="flex flex-wrap gap-2"
                imgClassName="max-w-[160px] rounded border"
                fallback={
                  <div className="text-sm text-gray-500 py-2">
                    첨부 이미지가 없습니다.
                  </div>
                }
              />
            </section>

            <section aria-label="관리자 답변">
              <h4 className="text-sm font-semibold mb-2">관리자 답변</h4>
              <AdminSuggestionReply
                suggestion={item}
                onUpdate={handleAnswered}
              />
            </section>

            <section aria-label="댓글 및 답변">
              <div
                className="mt-1 border-t border-dashed pt-3"
                style={{ borderColor: 'var(--primary-color)' }}
              >
                <h4
                  className="text-sm font-semibold mb-2"
                  style={{ color: 'var(--primary-color)' }}
                >
                  댓글 및 답변
                </h4>
                <AdminSuggestionComments
                  suggestPostId={item.id}
                  refreshKey={refreshTick}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </article>
  );
}

function safeNormalizeSuggestion(raw) {
  const createdAt =
    raw?.createdAt ||
    raw?.created_at ||
    raw?.created_date ||
    raw?.created ||
    [];
  return {
    id: raw?.id ?? raw?.suggest_id ?? raw?.suggestionId,
    userId: raw?.userId ?? raw?.user_id ?? raw?.uid,
    category: raw?.category ?? '',
    location: raw?.location ?? '',
    isAnswered: raw?.is_answered ?? raw?.answered ?? false,
    title: raw?.title ?? raw?.suggest_title ?? '',
    content: raw?.content ?? raw?.suggest_content ?? '',
    createdAt,
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

function formatDateOnly(arr) {
  if (!Array.isArray(arr) || arr.length < 3) return '';
  const [y, mo, d] = arr;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function tsDesc(b, a) {
  const db = toDate(b).getTime();
  const da = toDate(a).getTime();
  return db - da;
}

function toDate(arr) {
  if (!Array.isArray(arr)) return new Date(0);
  const [y, mo, d, h = 0, m = 0, s = 0] = arr;
  return new Date(y, (mo || 1) - 1, d || 1, h, m, s);
}

function formatFullDate(arr) {
  if (!Array.isArray(arr)) return '';
  const [y, mo, d, h = 0, m = 0] = arr;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(
    h,
  ).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
