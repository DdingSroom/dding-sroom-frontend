'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';
import axiosInstance from '../../../libs/api/instance';
import useTokenStore from '../../../stores/useTokenStore';
import ThumbByUrl from '../../../components/suggest/ThumbByUrl';
import FooterNav from '@components/common/FooterNav';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';

function BottomSafeSpacer({ height = 64 }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
    />
  );
}

export default function SuggestHistoryPage() {
  const router = useRouter();
  const { accessToken } = useTokenStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  // 로그인 체크
  useEffect(() => {
    if (!accessToken) router.push('/login');
  }, [accessToken, router]);

  const userId = useMemo(() => {
    try {
      if (!accessToken) return '';
      const decoded = jwtDecode(accessToken);
      return decoded.userId || decoded.user_id || decoded.id || '';
    } catch {
      return '';
    }
  }, [accessToken]);

  const toArray = (data) => {
    if (Array.isArray(data?.suggestions)) return data.suggestions;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  };

  const fetchMine = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const url = userId
        ? `/api/suggestions?user_id=${encodeURIComponent(userId)}`
        : '/api/suggestions';
      const res = await axiosInstance.get(url);

      const raw = toArray(res?.data);
      const list = raw
        .map(normalizeSuggest)
        .sort((a, b) => tsDesc(a.createdAt, b.createdAt));

      setItems(list);
    } catch (e) {
      const status = e?.response?.status;

      if (status === 403 || status === 404) {
        setItems([]);
        setError('');
      } else {
        setError(
          e?.response?.data?.message ||
            e?.response?.data?.error ||
            e?.message ||
            '내역을 불러오지 못했습니다.',
        );
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMine();
  }, [fetchMine]);

  // 날짜별 그룹
  const grouped = useMemo(() => {
    const b = {};
    for (const s of items) {
      const key = formatDateOnly(s.createdAt);
      if (!b[key]) b[key] = [];
      b[key].push(s);
    }
    return b;
  }, [items]);

  const dateKeys = useMemo(
    () =>
      Object.keys(grouped)
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a)),
    [grouped],
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[var(--border-light)]">
        <div className="px-5 py-4">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            건의/신고
          </h1>
        </div>

        {/* Tabs */}
        <nav className="px-5">
          <div className="flex space-x-8 border-b border-[var(--border-light)]">
            <Link
              href="/suggest"
              className="relative py-3 text-base text-[var(--text-muted)] hover:text-[var(--primary-color)]"
            >
              건의/신고
            </Link>
            <span className="relative py-3 text-base text-[var(--primary-color)]">
              건의/신고내역
              <span
                className="absolute left-0 -bottom-[1px] h-[3px] w-full rounded-full"
                style={{ backgroundColor: 'var(--primary-color)' }}
              />
            </span>
          </div>
        </nav>
      </header>

      <main className="flex-1 pb-8">
        {loading && (
          <div className="px-6 py-8 text-[var(--text-muted)]">로딩중…</div>
        )}

        {/* 에러는 진짜 실패 때만 표시. 403/404는 빈 상태로 처리 */}
        {error && <div className="px-6 py-8 text-red-500">{error}</div>}

        {!loading &&
          !error &&
          dateKeys.map((d) => (
            <section key={d} className="mb-2">
              <SectionHeader dateStr={formatKR(d)} />
              <ul className="space-y-0">
                {grouped[d].map((it) => (
                  <HistoryCard key={it.id} item={it} />
                ))}
              </ul>
            </section>
          ))}

        {!loading && !error && dateKeys.length === 0 && (
          <div className="px-6 py-16 text-center text-[var(--text-muted)]">
            등록된 건의/신고 내역이 없습니다.
          </div>
        )}
      </main>

      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav active="suggest" />
    </div>
  );
}

function StatusBadge({ status }) {
  const isDone = !!status;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs flex-shrink-0 whitespace-nowrap ${
        isDone
          ? 'bg-[#eef2ff] text-[var(--primary-color)]'
          : 'bg-[#f4f4f5] text-[var(--text-muted)]'
      }`}
    >
      {isDone ? '답변완료' : '답변대기중'}
    </span>
  );
}

function SectionHeader({ dateStr }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#eef2ff]/40 px-4 py-3 mx-4 mt-5 mb-3">
      <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--primary-color)]" />
      <span className="text-[15px] font-medium text-[var(--text-primary)]">
        {dateStr}
      </span>
    </div>
  );
}

function HistoryCard({ item }) {
  const { id, title, meta, isAnswered } = {
    id: item.id,
    title: item.title || '제목 없음',
    meta: `${item.category || '분류없음'} / ${item.location || '위치미상'}`,
    isAnswered: item.isAnswered,
  };

  return (
    <li className="px-4">
      <Link
        href={`/suggest/history/${id}`}
        className="block rounded-2xl bg-white shadow-sm border border-[var(--border-light)] px-4 py-4 mb-3 active:scale-[0.99] transition"
      >
        <div className="flex items-start gap-3">
          <ThumbByUrl suggestPostId={id} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="flex-1 min-w-0 text-[16px] leading-6 font-medium text-[var(--text-primary)] truncate">
                {title}
              </h3>
              <StatusBadge status={isAnswered} />
            </div>

            <p className="mt-1 text-xs text-[var(--text-secondary)]">{meta}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {formatFullDate(item.createdAt)}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}

function normalizeSuggest(raw) {
  const createdAt =
    raw?.createdAt ||
    raw?.created_at ||
    raw?.created_date ||
    raw?.created ||
    [];
  return {
    id: raw?.id ?? raw?.suggest_id ?? raw?.suggestionId,
    category: raw?.category ?? '',
    location: raw?.location ?? '',
    isAnswered: raw?.is_answered ?? raw?.answered ?? false,
    title: raw?.title ?? raw?.suggest_title ?? '',
    content: raw?.content ?? raw?.suggest_content ?? '',
    createdAt,
  };
}

function formatKR(yyyyMMDD) {
  if (!yyyyMMDD) return '';
  const [y, m, d] = yyyyMMDD.split('-');
  return `${y}. ${m}. ${d}.`;
}

function formatDateOnly(arr) {
  if (!Array.isArray(arr) || arr.length < 3) return '';
  const [y, mo, d] = arr;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function toDate(arr) {
  if (!Array.isArray(arr)) return new Date(0);
  const [y, mo, d, h = 0, m = 0, s = 0] = arr;
  return new Date(y, (mo || 1) - 1, d || 1, h, m, s);
}
function tsDesc(a, b) {
  return toDate(b) - toDate(a);
}
function formatFullDate(arr) {
  if (!Array.isArray(arr)) return '';
  const [y, mo, d, h = 0, m = 0] = arr;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
