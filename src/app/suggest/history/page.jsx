'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import FooterNav from '@components/common/FooterNav';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';

import { suggestion } from '@api/keys/suggestion.key';
import useRequireAuth from '@hooks/use-require-auth';
import useTokenStore from '@stores/useTokenStore';

import ThumbByUrl from '../../../components/suggest/ThumbByUrl';

function BottomSafeSpacer({ height = 64 }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
    />
  );
}

export default function SuggestHistoryPage() {
  const { authReady, requireLogin, redirectToLogin } = useRequireAuth();
  const { userId } = useTokenStore();

  const {
    data,
    isPending,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    ...suggestion.getList({ userId }),
    enabled: authReady && !!userId && !requireLogin,
    retry: false,
  });
  const status = queryError?.response?.status;
  const error =
    userId && !requireLogin && queryError && status !== 403 && status !== 404
      ? queryError.response?.data?.message ||
        queryError.response?.data?.error ||
        queryError.message ||
        '내역을 불러오지 못했습니다.'
      : '';

  // 로그인 체크
  useEffect(() => {
    if (requireLogin) {
      redirectToLogin();
    }
  }, [requireLogin, redirectToLogin]);

  const items = useMemo(() => {
    if (!userId || requireLogin || queryError) {
      return [];
    }
    const suggestions = Array.isArray(data?.suggestions)
      ? data.suggestions
      : [];

    return suggestions
      .map(normalizeSuggest)
      .sort((a, b) => tsDesc(a.createdAt, b.createdAt));
  }, [data, userId, requireLogin, queryError]);

  // (클라 수정 필요) 날짜 그룹 포매팅
  // 날짜별 그룹
  const grouped = useMemo(() => {
    const b = {};
    for (const s of items) {
      const key = formatDateOnly(s.createdAt);
      if (!b[key]) {
        b[key] = [];
      }
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
    <div className="min-h-screen bg-surface-suggest flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-line">
        <div className="px-5 py-4">
          <h1 className="text-2xl font-semibold text-content">건의/신고</h1>
        </div>

        {/* Tabs */}
        <nav className="px-5">
          <div className="flex space-x-8 border-b border-line">
            <Link
              href="/suggest"
              className="relative py-3 text-base text-content-muted hover:text-brand"
            >
              건의/신고
            </Link>
            <span className="relative py-3 text-base text-brand">
              건의/신고내역
              <span className="absolute left-0 bottom-tab-indicator h-tab-indicator w-full rounded-full bg-brand" />
            </span>
          </div>
        </nav>
      </header>

      <main className="flex-1 pb-8">
        {!authReady || (isPending && loading) ? (
          <div className="px-6 py-8 text-content-muted">로딩중…</div>
        ) : null}

        {/* 에러는 진짜 실패 때만 표시. 403/404는 빈 상태로 처리 */}
        {error && <div className="px-6 py-8 text-red-500">{error}</div>}

        {authReady &&
          !loading &&
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

        {authReady && !loading && !error && dateKeys.length === 0 && (
          <div className="px-6 py-16 text-center text-content-muted">
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
          ? 'bg-brand-lightest text-brand'
          : 'bg-surface-neutral text-content-muted'
      }`}
    >
      {isDone ? '답변완료' : '답변대기중'}
    </span>
  );
}

function SectionHeader({ dateStr }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-brand-lightest/40 px-4 py-3 mx-4 mt-5 mb-3">
      <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand" />
      <span className="text-md font-medium text-content">{dateStr}</span>
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
        className="block rounded-2xl bg-white shadow-sm border border-line px-4 py-4 mb-3 active:scale-press transition"
      >
        <div className="flex items-start gap-3">
          <ThumbByUrl suggestPostId={id} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="flex-1 min-w-0 text-base leading-6 font-medium text-content truncate">
                {title}
              </h3>
              <StatusBadge status={isAnswered} />
            </div>

            <p className="mt-1 text-xs text-content-secondary">{meta}</p>
            <p className="mt-1 text-xs text-content-muted">
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
  return yyyyMMDD.replaceAll('-', '. ') + '.';
}

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateOnly(value) {
  return parseDate(value)?.toLocaleDateString('sv-SE') ?? '';
}

function tsDesc(a, b) {
  return (parseDate(b)?.getTime() ?? 0) - (parseDate(a)?.getTime() ?? 0);
}

function formatFullDate(value) {
  return (
    parseDate(value)?.toLocaleString('sv-SE', {
      dateStyle: 'short',
      timeStyle: 'short',
    }) ?? ''
  );
}
