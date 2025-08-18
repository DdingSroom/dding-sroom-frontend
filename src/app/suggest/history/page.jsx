'use client';

import Link from 'next/link';
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

const sections = [
  {
    dateStr: '2025. 08. 18.',
    items: [
      {
        id: 'a1',
        title: '분실물 관련 문의드립니다.',
        meta: '분실물 / 스터디룸1',
        status: 'WAIT',
        time: '16:20 ~ 18:20',
        thumb: '/static/sample/thumb-01.jpg',
      },
      {
        id: 'a2',
        title: '시설 소음이 심합니다.',
        meta: '소음 / 공용공간',
        status: 'DONE',
        time: '14:10 등록',
      },
    ],
  },
  {
    dateStr: '2025. 08. 15.',
    items: [
      {
        id: 'b1',
        title: '에어컨 고장 신고',
        meta: '시설고장 / 스터디룸2',
        status: 'DONE',
        time: '10:00 등록',
      },
    ],
  },
];

function StatusBadge({ status }) {
  const isDone = status === 'DONE';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${
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
  const { id, title, meta, status, time, thumb } = item;
  return (
    <li className="px-4">
      <Link
        href={`/suggest/history/${id}`}
        className="block rounded-2xl bg-white shadow-sm border border-[var(--border-light)] px-4 py-4 mb-3 active:scale-[0.99] transition"
      >
        <div className="flex items-start gap-3">
          {thumb ? (
            <div className="w-[64px] h-[64px] rounded-xl overflow-hidden shrink-0 bg-[#f3f4f6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb} alt="" className="w-full h-full object-cover" />
            </div>
          ) : null}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[16px] leading-6 font-medium text-[var(--text-primary)] truncate">
                {title}
              </h3>
              <StatusBadge status={status} />
            </div>

            <p className="mt-1 text-xs text-[var(--text-secondary)]">{meta}</p>
            {time ? (
              <p className="mt-1 text-xs text-[var(--text-muted)]">{time}</p>
            ) : null}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default function SuggestHistoryPage() {
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
        {sections.map((sec) => (
          <section key={sec.dateStr} className="mb-2">
            <SectionHeader dateStr={sec.dateStr} />
            <ul className="space-y-0">
              {sec.items.map((it) => (
                <HistoryCard key={it.id} item={it} />
              ))}
            </ul>
          </section>
        ))}

        {sections.length === 0 && (
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
