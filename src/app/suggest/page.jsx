'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FooterNav from '@components/common/FooterNav';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';
import axiosInstance from '../../libs/api/instance';

const MAX_TITLE = 20;
const MAX_CONTENT = 3000;
const MAX_FILES = 5;
const MAX_TOTAL_SIZE = 30 * 1024 * 1024;

const categories = ['분실물', '기물파손', '시설고장', '소음공해', '기타'];
const places = [
  '스터디룸 1',
  '스터디룸 2',
  '스터디룸 3',
  '스터디룸 4',
  '스터디룸 5',
];
const ALLOWED_LOCATIONS = [
  '스터디룸1',
  '스터디룸2',
  '스터디룸3',
  '스터디룸4',
  '스터디룸5',
];
const normalizeLocation = (label) => String(label).replace(/\s+/g, '');

function BottomSafeSpacer({ height = 64 }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
    />
  );
}
const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(1);

export default function SuggestPage() {
  const router = useRouter();

  const [category, setCategory] = useState(categories[0]);
  const [place, setPlace] = useState(places[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});

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
    setFiles(deduped.slice(0, MAX_FILES));
  };

  const removeFile = (name, size) => {
    setFiles((prev) =>
      prev.filter((f) => !(f.name === name && f.size === size)),
    );
    setUploadProgress((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const pickFiles = () => fileInputRef.current?.click();

  const parseError = (err) =>
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    (typeof err?.response?.data === 'string' ? err.response.data : '') ||
    (err?.response?.data ? JSON.stringify(err.response.data) : '') ||
    err?.message ||
    '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

  const extractSuggestionId = (res) =>
    res?.data?.suggest_post_id ??
    res?.data?.suggest_id ??
    res?.data?.id ??
    res?.data?.data?.id ??
    null;

  async function createSuggestion() {
    const normalizedLocation = normalizeLocation(place);

    if (!ALLOWED_LOCATIONS.includes(normalizedLocation)) {
      throw new Error(
        `유효하지 않은 위치 값입니다: '${place}'. 유효한 값: ${ALLOWED_LOCATIONS.join(', ')}`,
      );
    }

    const payload = {
      suggest_title: title.trim(),
      suggest_content: content.trim(),
      category: String(category).trim(),
      location: normalizedLocation,
    };

    try {
      const res = await axiosInstance.post('/api/suggestions', payload);
      const suggestionId = extractSuggestionId(res);
      if (!suggestionId) {
        console.warn(
          '[SuggestPage] 서버 응답에서 ID를 찾지 못했습니다.',
          res?.data,
        );
      }
      return suggestionId;
    } catch (err) {
      console.error('[POST /api/suggestions] failed', {
        status: err?.response?.status,
        data: err?.response?.data,
        payload,
      });
      throw err;
    }
  }

  async function fetchLatestSuggestionId() {
    try {
      const normalizedLocation = normalizeLocation(place);
      const res = await axiosInstance.get('/api/suggestions', {
        params: { category, location: normalizedLocation },
      });
      const list = Array.isArray(res?.data?.suggestions)
        ? res.data.suggestions
        : Array.isArray(res?.data)
          ? res.data
          : [];
      if (list.length === 0) return null;

      const normalized = list.map((raw) => ({
        id: raw?.id ?? raw?.suggest_id ?? raw?.suggestionId ?? null,
        createdAt: raw?.createdAt ?? raw?.created_at ?? raw?.created_date ?? [],
      }));

      const toTs = (arr) => {
        if (Array.isArray(arr)) {
          const [y, mo, d, h = 0, m = 0, s = 0] = arr;
          return new Date(y, (mo || 1) - 1, d || 1, h, m, s).getTime();
        }
        const t = Date.parse(arr);
        return Number.isFinite(t) ? t : 0;
      };

      normalized.sort((a, b) => toTs(b.createdAt) - toTs(a.createdAt));
      return normalized[0]?.id ?? null;
    } catch (err) {
      console.warn(
        '[GET /api/suggestions] 최신 ID 조회 실패',
        err?.response?.data || err?.message,
      );
      return null;
    }
  }

  async function uploadSingleImage(suggestionId, file) {
    if (!file) return null;

    const attempts = [
      (id) => {
        const fd = new FormData();
        fd.append(
          'request',
          new Blob([JSON.stringify(id ? { suggest_post_id: id } : {})], {
            type: 'application/json',
          }),
        );
        fd.append('image_file', file, file.name);
        return fd;
      },
      (id) => {
        const fd = new FormData();
        fd.append(
          'request',
          new Blob([JSON.stringify(id ? { suggest_id: id } : {})], {
            type: 'application/json',
          }),
        );
        fd.append('image_file', file, file.name);
        return fd;
      },
      (id) => {
        const fd = new FormData();
        if (id) fd.append('suggest_post_id', id);
        fd.append('image_file', file, file.name);
        return fd;
      },
      (id) => {
        const fd = new FormData();
        if (id) fd.append('suggest_id', id);
        fd.append('image_file', file, file.name);
        return fd;
      },
      (id) => {
        const fd = new FormData();
        fd.append(
          'request',
          new Blob([JSON.stringify(id ? { suggest_post_id: id } : {})], {
            type: 'application/json',
          }),
        );
        fd.append('imageFile', file, file.name);
        return fd;
      },
      (id) => {
        const fd = new FormData();
        if (id) fd.append('suggest_post_id', id);
        fd.append('imageFile', file, file.name);
        return fd;
      },
    ];

    let lastErr;
    for (let i = 0; i < attempts.length; i++) {
      try {
        const fd = attempts[i](suggestionId);
        const res = await axiosInstance.post('/api/suggestions/images', fd, {
          onUploadProgress: (evt) => {
            if (!evt.total) return;
            const percent = Math.round((evt.loaded * 100) / evt.total);
            setUploadProgress((prev) => ({ ...prev, [file.name]: percent }));
          },
        });
        return res?.data;
      } catch (err) {
        lastErr = err;
        const status = err?.response?.status;
        const data = err?.response?.data;
        console.warn(`[POST /api/suggestions/images] attempt ${i + 1} failed`, {
          status,
          data,
        });
        if (status && status >= 500) break;
      }
    }
    throw lastErr;
  }

  async function uploadAllImages(suggestionIdMaybeNull) {
    let suggestionId = suggestionIdMaybeNull;
    if (!suggestionId) {
      suggestionId = await fetchLatestSuggestionId();
      if (!suggestionId) {
        console.info(
          '[SuggestPage] suggestionId를 끝내 찾지 못했습니다. ID 없이 업로드를 시도합니다.',
        );
      }
    }

    const targets = files.slice(0, MAX_FILES);
    const results = [];
    for (const f of targets) {
      const data = await uploadSingleImage(suggestionId, f);
      results.push({ file: f.name, data });
    }
    return results;
  }

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (hasError) return;
    if (!title.trim()) return setErrorMsg('제목을 입력해 주세요.');
    if (!content.trim()) return setErrorMsg('내용을 입력해 주세요.');

    try {
      setSubmitting(true);

      const suggestionId = await createSuggestion();

      if (files.length > 0) {
        await uploadAllImages(suggestionId);
      }

      setSuccessMsg('건의가 정상적으로 접수되었어요.');
      setTitle('');
      setContent('');
      setFiles([]);
      setUploadProgress({});
    } catch (err) {
      setErrorMsg(parseError(err));
    } finally {
      setSubmitting(false);
    }
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
          {/* 분류 */}
          <section className="rounded-xl bg-white border border-[var(--border-light)]">
            <label className="block px-4 pt-4 pb-2 text-[15px] font-semibold text-[var(--text-primary)]">
              건의/신고 분류
            </label>
            <div className="px-4 pb-4">
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-lg border bg-[#fbfbfb] px-4 py-3 pr-10 text-[15px]"
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

          {/* 장소 */}
          <section className="rounded-xl bg-white border border-[var(--border-light)]">
            <label className="block px-4 pt-4 pb-2 text-[15px] font-semibold text-[var(--text-primary)]">
              건의/신고 장소
            </label>
            <div className="px-4 pb-4">
              <div className="relative">
                <select
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full appearance-none rounded-lg border bg-[#fbfbfb] px-4 py-3 pr-10 text-[15px]"
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

          {/* 제목 */}
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
                  className="w-full rounded-lg border bg-[#fbfbfb] px-4 py-3 text-[15px]"
                />
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${overTitle ? 'text-red-500' : 'text-[var(--text-muted)]'}`}
                >
                  {titleCount}/{MAX_TITLE}
                </span>
              </div>
            </div>
          </section>

          {/* 내용 */}
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
                className="w-full resize-y rounded-lg border bg-[#fbfbfb] px-4 py-3 text-[15px]"
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

          {/* 이미지 첨부 */}
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
                    className="flex items-center justify-between rounded-lg border bg-[#fbfbfb] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[15px]">
                        {f.name}
                        {uploadProgress[f.name] != null && (
                          <span className="ml-2 text-xs text-[var(--text-muted)]">
                            {uploadProgress[f.name]}%
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {bytesToMB(f.size)}MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(f.name, f.size)}
                      aria-label="파일 제거"
                      className="shrink-0 p-1"
                      disabled={submitting && uploadProgress[f.name] > 0}
                      title={
                        submitting && uploadProgress[f.name] > 0
                          ? '업로드 중에는 삭제할 수 없습니다'
                          : '삭제'
                      }
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
            <div className="flex items-center justify-end border-t px-4 py-2 text-sm">
              <span
                className={`${overTotal ? 'text-red-500' : 'text-[var(--text-muted)]'}`}
              >
                {totalSizeMB}/30MB
              </span>
            </div>
          </section>

          {/* 제출 */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={hasError || submitting}
              className={`w-full rounded-xl py-4 text-base font-semibold text-white shadow-sm transition active:scale-[0.99] ${
                hasError || submitting
                  ? 'bg-[#bfc8ff] cursor-not-allowed'
                  : 'bg-[var(--primary-color)]'
              }`}
            >
              {submitting ? '전송 중...' : '건의/신고하기'}
            </button>

            {errorMsg && (
              <p className="mt-2 text-center text-sm text-red-500" role="alert">
                {errorMsg}
              </p>
            )}
            {successMsg && (
              <p className="mt-2 text-center text-sm text-green-600">
                {successMsg}
              </p>
            )}

            {hasError && !errorMsg && (
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
