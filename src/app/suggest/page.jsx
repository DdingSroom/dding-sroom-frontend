'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FooterNav from '@components/common/FooterNav';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';

const MAX_TITLE = 20;
const MAX_CONTENT = 3000;
const MAX_FILES = 5;
const MAX_TOTAL_SIZE = 30 * 1024 * 1024;

const categories = ['분실물', '시설', '소음', '미예약 사용자', '기타'];
const places = [
  '스터디룸 1',
  '스터디룸 2',
  '스터디룸 3',
  '스터디룸 4',
  '스터디룸 5',
];

function BottomSafeSpacer({ height = 64 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        height: `calc(${height}px + env(safe-area-inset-bottom, 0px))`,
      }}
    />
  );
}

function bytesToMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export default function SuggestPage() {
  const router = useRouter();

  const [category, setCategory] = useState(categories[0]);
  const [place, setPlace] = useState(places[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const titleCount = title.length;
  const contentCount = content.length;

  const totalSize = useMemo(
    () => files.reduce((acc, f) => acc + f.size, 0),
    [files],
  );
  const totalSizeMB = `${bytesToMB(totalSize)}MB`;

  const overTitle = titleCount > MAX_TITLE;
  const overContent = contentCount > MAX_CONTENT;
  const overFiles = files.length > MAX_FILES;
  const overTotal = totalSize > MAX_TOTAL_SIZE;

  const hasError = overTitle || overContent || overFiles || overTotal;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const merged = [...files, ...selected];
    const deduped = merged.filter(
      (f, idx, arr) =>
        idx === arr.findIndex((x) => x.name === f.name && x.size === f.size),
    );
    setFiles(deduped);
  };

  const removeFile = (name, size) => {
    setFiles((prev) =>
      prev.filter((f) => !(f.name === name && f.size === size)),
    );
  };

  const pickFiles = () => fileInputRef.current?.click();

  const submit = (e) => {
    e.preventDefault();
    if (hasError) return;
    alert('건의가 제출되었다고 가정합니다 :)');
    setTitle('');
    setContent('');
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[var(--border-light)]">
        <div className="px-5 py-4">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            건의/신고
          </h1>
        </div>

        {/* Tabs */}
        <nav className="px-5">
          <div className="flex space-x-8 border-b border-[var(--border-light)]">
            <span className="relative py-3 text-base text-[var(--primary-color)]">
              건의/신고
              <span
                className="absolute left-0 -bottom-[1px] h-[3px] w-full rounded-full"
                style={{ backgroundColor: 'var(--primary-color)' }}
              />
            </span>

            <Link
              href="/suggest/history"
              className="relative py-3 text-base text-[var(--text-muted)] hover:text-[var(--primary-color)]"
            >
              건의/신고내역
            </Link>
          </div>
        </nav>
      </header>

      {/* Form Body */}
      <main className="px-5 pt-4 bg-[#f5f7fb] flex-1">
        <form onSubmit={submit} className="space-y-5 pb-8">
          <section className="rounded-xl bg-white border border-[var(--border-light)]">
            <label className="block px-4 pt-4 pb-2 text-[15px] font-semibold text-[var(--text-primary)]">
              건의/신고 분류
            </label>
            <div className="px-4 pb-4">
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[var(--border-light)] bg-[#fbfbfb] px-4 py-3 pr-10 text-[15px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="#9b9998"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white border border-[var(--border-light)]">
            <label className="block px-4 pt-4 pb-2 text-[15px] font-semibold text-[var(--text-primary)]">
              건의/신고 장소
            </label>
            <div className="px-4 pb-4">
              <div className="relative">
                <select
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[var(--border-light)] bg-[#fbfbfb] px-4 py-3 pr-10 text-[15px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                >
                  {places.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="#9b9998"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white border border-[var(--border-light)]">
            <label className="block px-4 pt-4 pb-2 text-[15px] font-semibold text-[var(--text-primary)]">
              건의/신고 제목
            </label>
            <div className="px-4 pb-2">
              <div className="relative">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력해 주세요(20자 이내)"
                  className="w-full rounded-lg border border-[var(--border-light)] bg-[#fbfbfb] px-4 py-3 text-[15px] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                />
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${overTitle ? 'text-red-500' : 'text-[var(--text-muted)]'}`}
                >
                  {titleCount}/{MAX_TITLE}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white border border-[var(--border-light)]">
            <label className="block px-4 pt-4 pb-2 text-[15px] font-semibold text-[var(--text-primary)]">
              건의/신고 내용
            </label>
            <div className="px-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 보내주시면 문의확인에 도움이 됩니다."
                rows={10}
                className="w-full resize-y rounded-lg border border-[var(--border-light)] bg-[#fbfbfb] px-4 py-3 text-[15px] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              />
            </div>
            <div className="px-4 py-2 text-right text-sm">
              <span
                className={
                  overContent ? 'text-red-500' : 'text-[var(--text-muted)]'
                }
              >
                {contentCount}/{MAX_CONTENT}
              </span>
            </div>
          </section>

          <section className="rounded-xl bg-white border border-[var(--border-light)]">
            <button
              type="button"
              onClick={pickFiles}
              className="flex w-full items-center justify-between gap-3 px-4 py-3"
            >
              <span className="text-[15px] font-medium text-[var(--text-primary)]">
                + 이미지 첨부
              </span>
              <span className="text-[var(--text-muted)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="inline-block align-[-2px]"
                >
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="#9b9998"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {files.length > 0 && (
              <ul className="px-4 pb-3 space-y-2">
                {files.slice(0, MAX_FILES).map((f) => (
                  <li
                    key={`${f.name}-${f.size}`}
                    className="flex items-center justify-between rounded-lg border border-[var(--border-light)] bg-[#fbfbfb] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[15px]">{f.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {bytesToMB(f.size)}MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(f.name, f.size)}
                      aria-label="파일 제거"
                      className="shrink-0 p-1"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M15 9l-6 6M9 9l6 6"
                          stroke="#9b9998"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="px-4 pb-3 text-sm text-[var(--text-muted)]">
              첨부파일은 최대 5개, 30MB까지 등록 가능합니다.
            </div>
            <div className="flex items-center justify-end border-t border-[var(--border-light)] px-4 py-2 text-sm">
              <span
                className={`${overTotal ? 'text-red-500' : 'text-[var(--text-muted)]'}`}
              >
                {totalSizeMB}/30MB
              </span>
            </div>
          </section>

          <div className="pt-2">
            <button
              type="submit"
              disabled={hasError}
              className={`w-full rounded-xl py-4 text-base font-semibold text-white shadow-sm transition active:scale-[0.99] ${
                hasError
                  ? 'bg-[#bfc8ff] cursor-not-allowed'
                  : 'bg-[var(--primary-color)]'
              }`}
            >
              건의/신고하기
            </button>
            {hasError && (
              <p className="mt-2 text-center text-sm text-red-500">
                {overTitle && '제목은 20자 이내여야 합니다. '}
                {overContent && '내용은 3000자 이내여야 합니다. '}
                {overFiles && '파일은 최대 5개까지 등록 가능합니다. '}
                {overTotal && '총 용량은 30MB를 초과할 수 없습니다.'}
              </p>
            )}
          </div>
        </form>
      </main>

      <PrivacyPolicyFooter />

      <BottomSafeSpacer height={64} />

      <FooterNav active="suggest" />
    </div>
  );
}
