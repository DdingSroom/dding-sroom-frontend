'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '../../libs/api/instance';
import ProtectedImage from './ProtectedImage';

export default function SuggestionImagesByUrl({
  suggestPostId,
  className = '',
  imgClassName = 'max-w-[160px] rounded border',
  fallback = (
    <div className="text-sm text-gray-500 py-2">첨부 이미지가 없습니다.</div>
  ),
  useProtectedFallback = false,
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const res = await axiosInstance.get('/api/suggestions/images', {
          params: { suggest_post_id: suggestPostId },
          headers: { Accept: 'application/json' },
        });
        const arr = Array.isArray(res?.data?.images)
          ? res.data.images
          : Array.isArray(res?.data)
            ? res.data
            : [];

        const normalized = arr
          .map((x) => ({
            id: x?.id ?? x?.image_id ?? x?.file_id ?? `${x?.file_url || ''}`,
            url: x?.file_url ?? x?.url ?? '',
            type: x?.file_type ?? '',
            name: x?.file_name ?? '',
          }))
          .filter((x) => !!x.url);

        if (mounted) setImages(normalized);
      } catch (e) {
        if (mounted) setErr(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (suggestPostId) load();
    return () => {
      mounted = false;
    };
  }, [suggestPostId]);

  if (loading)
    return (
      <div className={`text-sm text-gray-400 ${className}`}>로딩중...</div>
    );
  if (err) {
    console.warn(
      '[SuggestionImagesByUrl] 목록 조회 실패:',
      err?.response?.data || err?.message,
    );
    return useProtectedFallback ? (
      <ProtectedImage suggestPostId={suggestPostId} className={imgClassName} />
    ) : (
      fallback
    );
  }
  if (images.length === 0) {
    return useProtectedFallback ? (
      <ProtectedImage suggestPostId={suggestPostId} className={imgClassName} />
    ) : (
      fallback
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {images.map((img, i) => (
        <a
          key={img.id ?? i}
          href={img.url}
          target="_blank"
          rel="noreferrer"
          title="이미지 새 창에서 보기"
        >
          <img
            src={img.url}
            alt={img.name || `image-${i}`}
            className={imgClassName}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </a>
      ))}
    </div>
  );
}
