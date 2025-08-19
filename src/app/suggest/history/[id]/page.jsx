'use client';

import { useRouter, usePathname } from 'next/navigation';
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

function SuggestDetailHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (pathname === '/my/account-info') router.push('/');
    else router.back();
  };

  return (
    <header className="flex items-center px-6 py-4 pt-12 pb-8 bg-white border-b border-gray-100 relative">
      <button
        onClick={handleBack}
        className="p-2 hover:bg-gray-50 rounded-lg transition-colors -ml-2"
      >
        <img
          src="/static/icons/arrow_left_icon.svg"
          alt="Back"
          className="w-5 h-5"
        />
      </button>

      <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-[#37352f]">
        건의/신고내역
      </div>
    </header>
  );
}

// 데모 데이터
const mockDetail = {
  id: '1',
  title: '건의 제목입니다.',
  meta: '분실물 | 스터디룸1',
  content:
    '건의내용입니다.\n최대 글자가 정해져있습니다.\n문단 수(엔터)에 따라 박스의 길이가 조절됩니다.',
  answer: '답변내용입니다.',
  status: 'DONE',
};

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

export default function SuggestHistoryDetailPage({ params }) {
  const d = mockDetail;

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <SuggestDetailHeader />

      <main className="flex-1 px-4 py-5">
        <section className="rounded-2xl bg-white shadow-sm border border-[var(--border-light)]">
          <div className="px-5 pt-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-[17px] leading-6 font-medium text-[var(--text-primary)]">
                {d.title}
              </h2>
              <StatusBadge status={d.status} />
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {d.meta}
            </p>
          </div>

          <div className="px-5 pt-4 pb-5">
            <div className="whitespace-pre-wrap text-[15px] leading-6 text-[var(--text-primary)]">
              {d.content}
            </div>
          </div>

          <div className="h-[10px] bg-[#eef0f5]" />

          <div className="px-5 py-5">
            <div className="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 12h8l-3-3m3 3l-3 3"
                  stroke="#788cff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[15px] text-[var(--text-primary)]">
                답변내용입니다.
              </span>
            </div>

            <div className="rounded-xl bg-[#f8f9ff] border border-[var(--border-light)] px-4 py-3">
              <div className="whitespace-pre-wrap text-[15px] leading-6 text-[var(--text-secondary)]">
                {d.answer}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PrivacyPolicyFooter />

      <BottomSafeSpacer height={64} />

      <FooterNav active="suggest" />
    </div>
  );
}
