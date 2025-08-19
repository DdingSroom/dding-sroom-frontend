'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axiosInstance from '../../../../libs/api/instance';
import FooterNav from '@components/common/FooterNav';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';
import SuggestionImagesByUrl from '../../../../components/admin/SuggestionImagesByUrl';

const CATEGORIES = ['분실물', '기물파손', '시설고장', '소음공해', '기타'];
const PLACES = [
  '스터디룸1',
  '스터디룸2',
  '스터디룸3',
  '스터디룸4',
  '스터디룸5',
];

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/static/icons/arrow_left_icon.svg"
          alt="Back"
          className="w-5 h-5"
        />
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-[#37352f]">
        건의/신고내역
      </div>
    </header>
  );
}

function StatusBadge({ done }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${
        done
          ? 'bg-[#eef2ff] text-[var(--primary-color)]'
          : 'bg-[#f4f4f5] text-[var(--text-muted)]'
      }`}
    >
      {done ? '답변완료' : '답변대기중'}
    </span>
  );
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

function toDate(arr) {
  if (!Array.isArray(arr)) return new Date(0);
  const [y, mo, d, h = 0, m = 0, s = 0] = arr;
  return new Date(y, (mo || 1) - 1, d || 1, h, m, s);
}

function safeNormalizeSuggestion(raw) {
  if (!raw) return null;
  const createdAt =
    raw?.createdAt ||
    raw?.created_at ||
    raw?.created_date ||
    raw?.created ||
    [];

  return {
    id: raw?.id ?? raw?.suggest_id ?? raw?.suggestId,
    title: raw?.title ?? raw?.suggest_title ?? raw?.subject ?? '',
    content: raw?.content ?? raw?.suggest_content ?? '',
    category: raw?.category ?? '',
    location: raw?.location ?? '',
    isAnswered: raw?.is_answered ?? raw?.answered ?? raw?.isAnswered ?? false,
    createdAt,
  };
}

function formatMeta(cat, loc) {
  if (!cat && !loc) return '';
  if (!cat) return loc;
  if (!loc) return cat;
  return `${cat} | ${loc}`;
}

function pickLatestAnswerText(list) {
  if (!Array.isArray(list)) return '';
  const candidates = list
    .map((c) => ({
      txt:
        c?.answer_content ??
        c?.answerContent ??
        c?.admin_answer ??
        c?.adminAnswer ??
        '',
      at:
        c?.answered_at || c?.answeredAt || c?.createdAt || c?.created_at || [],
    }))
    .filter((x) => !!String(x.txt || '').trim());
  if (candidates.length === 0) return '';
  candidates.sort((a, b) => +toDate(b.at) - +toDate(a.at));
  return candidates[0].txt;
}

export default function SuggestHistoryDetailPage({ params }) {
  const router = useRouter();
  const suggestId = useMemo(() => Number(params?.id), [params?.id]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [answerText, setAnswerText] = useState('');

  // 수정 UI 상태
  const [editing, setEditing] = useState(false);
  const [eTitle, setETitle] = useState('');
  const [eContent, setEContent] = useState('');
  const [eCategory, setECategory] = useState(CATEGORIES[0]);
  const [eLocation, setELocation] = useState(PLACES[0]);
  const [eAnswered, setEAnswered] = useState(false);
  const [saving, setSaving] = useState(false);
  const [opMsg, setOpMsg] = useState('');
  const [acknowledgeAnswered, setAcknowledgeAnswered] = useState(false);

  const fetchDetail = useCallback(async () => {
    const res = await axiosInstance.get('/api/suggestions', {
      params: { suggest_id: suggestId },
    });

    const payload =
      res?.data?.suggestions ??
      res?.data?.data ??
      res?.data?.suggestion ??
      res?.data;

    const raw = Array.isArray(payload) ? payload[0] : payload;
    return safeNormalizeSuggestion(raw);
  }, [suggestId]);

  const fetchComments = useCallback(async () => {
    const res = await axiosInstance.get('/api/suggestions/comments', {
      params: { suggest_post_id: suggestId },
    });
    return Array.isArray(res?.data?.comments)
      ? res.data.comments
      : (res?.data ?? []);
  }, [suggestId]);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [d, cmts] = await Promise.all([fetchDetail(), fetchComments()]);
      setDetail(d);
      setComments(cmts);
      setAnswerText(pickLatestAnswerText(cmts));
    } catch (e) {
      setError(parseError(e));
    } finally {
      setLoading(false);
    }
  }, [fetchDetail, fetchComments]);

  useEffect(() => {
    if (Number.isFinite(suggestId)) reload();
  }, [suggestId, reload]);

  const beginEdit = () => {
    if (!detail) return;
    setETitle(detail.title || '');
    setEContent(detail.content || '');
    setECategory(detail.category || CATEGORIES[0]);
    setELocation(detail.location || PLACES[0]);
    setEAnswered(Boolean(detail.isAnswered) || !!answerText);
    setAcknowledgeAnswered(false);
    setEditing(true);
    setOpMsg('');
  };
  const cancelEdit = () => {
    setEditing(false);
    setOpMsg('');
  };

  const saveEdit = async () => {
    if (!detail) return;
    if (!eTitle.trim()) return setOpMsg('제목을 입력해 주세요.');
    if (!eContent.trim()) return setOpMsg('내용을 입력해 주세요.');

    // 이미 답변된 건의사항인 경우 체크박스 확인 필수
    const wasAnswered = Boolean(detail.isAnswered) || !!answerText;
    if (wasAnswered && !acknowledgeAnswered) {
      return setOpMsg(
        '이미 답변된 내용이어서 답변이 새로 달리지 않습니다에 체크해주세요.',
      );
    }

    try {
      setSaving(true);
      setOpMsg('');
      await axiosInstance.put('/api/suggestions', {
        suggest_id: detail.id,
        suggest_title: eTitle.trim(),
        suggest_content: eContent.trim(),
        category: eCategory,
        location: eLocation,
        is_answered: Boolean(eAnswered),
      });
      await reload();
      setEditing(false);
      setOpMsg('수정이 완료되었습니다.');
    } catch (e) {
      setOpMsg(parseError(e));
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async () => {
    if (!detail) return;
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    try {
      setSaving(true);
      setOpMsg('');
      await axiosInstance.delete(`/api/suggestions/${detail.id}`);
      setOpMsg('삭제되었습니다.');
      router.push('/suggest/history');
    } catch (e) {
      setOpMsg(parseError(e));
    } finally {
      setSaving(false);
    }
  };

  const meta = useMemo(
    () => formatMeta(detail?.category, detail?.location),
    [detail?.category, detail?.location],
  );
  const isDone = Boolean(detail?.isAnswered) || !!answerText;

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <SuggestDetailHeader />

      <main className="flex-1 px-4 py-5">
        <section className="rounded-2xl bg-white shadow-sm border border-[var(--border-light)]">
          {loading && (
            <div className="px-5 py-5 text-sm text-[var(--text-muted)]">
              로딩 중...
            </div>
          )}
          {error && (
            <div className="px-5 py-5 text-sm text-red-500">{error}</div>
          )}

          {!loading && !error && detail && (
            <>
              <div className="px-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[17px] leading-6 font-medium text-[var(--text-primary)] break-words">
                      {detail.title || '제목 없음'}
                    </h2>
                    {meta && (
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        {meta}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <StatusBadge done={isDone} />
                    {!editing ? (
                      <>
                        <button
                          onClick={beginEdit}
                          className="px-3 py-1.5 text-sm rounded bg-[#eef2ff] text-[var(--primary-color)] border hover:bg-[#e0e7ff]"
                        >
                          수정
                        </button>
                        <button
                          onClick={deleteItem}
                          className="px-3 py-1.5 text-sm rounded bg-[#ffe7e7] text-[#c0392b] border hover:bg-[#ffdede]"
                        >
                          삭제
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              {!editing ? (
                <>
                  <div className="px-5 pt-4">
                    <div className="whitespace-pre-wrap text-[15px] leading-6 text-[var(--text-primary)] break-words">
                      {detail.content || '내용이 없습니다.'}
                    </div>
                  </div>

                  <div className="px-5 pt-4 pb-5">
                    <h4 className="text-sm font-semibold mb-2">첨부 이미지</h4>
                    <SuggestionImagesByUrl
                      suggestPostId={detail.id}
                      className="flex flex-wrap gap-2"
                      imgClassName="max-w-[160px] rounded border"
                      fallback={
                        <div className="text-sm text-gray-500 py-2">
                          첨부 이미지가 없습니다.
                        </div>
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="px-5 pt-4 pb-5 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      제목
                    </label>
                    <input
                      value={eTitle}
                      onChange={(e) => setETitle(e.target.value)}
                      className="w-full rounded border px-3 py-2 text-sm"
                      placeholder="제목"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      내용
                    </label>
                    <textarea
                      rows={8}
                      value={eContent}
                      onChange={(e) => setEContent(e.target.value)}
                      className="w-full rounded border px-3 py-2 text-sm"
                      placeholder="내용"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        분류
                      </label>
                      <select
                        value={eCategory}
                        onChange={(e) => setECategory(e.target.value)}
                        className="w-full rounded border px-3 py-2 text-sm bg-white"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        장소
                      </label>
                      <select
                        value={eLocation}
                        onChange={(e) => setELocation(e.target.value)}
                        className="w-full rounded border px-3 py-2 text-sm bg-white"
                      >
                        {PLACES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 이미 답변된 건의사항 수정 시 체크박스 */}
                  {(Boolean(detail?.isAnswered) || !!answerText) && (
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={acknowledgeAnswered}
                        onChange={(e) =>
                          setAcknowledgeAnswered(e.target.checked)
                        }
                        className="accent-blue-500 w-4 h-4"
                      />
                      <span className="text-black">
                        이미 답변된 내용이어서 답변이 새로 달리지 않습니다.
                      </span>
                    </label>
                  )}

                  {opMsg && (
                    <p
                      className={`text-sm ${opMsg.includes('완료') ? 'text-green-600' : 'text-red-500'}`}
                    >
                      {opMsg}
                    </p>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50"
                      disabled={saving}
                    >
                      취소
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-3 py-2 text-sm rounded bg-[var(--primary-color)] text-white hover:opacity-90 disabled:opacity-60"
                      disabled={saving}
                    >
                      {saving ? '저장 중...' : '저장'}
                    </button>
                  </div>
                </div>
              )}

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
                    {answerText
                      ? '답변내용입니다.'
                      : '아직 답변이 등록되지 않았습니다.'}
                  </span>
                </div>

                <div className="rounded-xl bg-[#f8f9ff] border border-[var(--border-light)] px-4 py-3">
                  <div className="whitespace-pre-wrap text-[15px] leading-6 text-[var(--text-secondary)]">
                    {answerText || '관리자 답변이 등록되면 이곳에 표시됩니다.'}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav active="suggest" />
    </div>
  );
}
