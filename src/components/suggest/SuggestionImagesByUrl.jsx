'use client';

import { suggestion } from '@api/keys/suggestion.key';
import { useQuery } from '@tanstack/react-query';

export default function SuggestionImagesByUrl({
  suggestPostId,
  className = '',
  imgClassName = 'max-w-thumb rounded border',
  fallback = (
    <div className="text-sm text-gray-500 py-2">첨부 이미지가 없습니다.</div>
  ),
}) {
  const enabled = !!suggestPostId;

  const {
    data: images = [],
    isPending,
    isLoading,
    isError,
    error,
  } = useQuery({
    ...suggestion.getImages(Number(suggestPostId)),
    enabled,
    retry: false,
    select: (data) => {
      // 응답 데이터 규격에 맞춰 배열 추출
      const arr = Array.isArray(data?.images)
        ? data.images
        : Array.isArray(data)
          ? data
          : [];

      return arr
        .map((x) => ({
          id: x?.id ?? x?.image_id ?? x?.file_id ?? `${x?.file_url || ''}`,
          url: x?.file_url ?? x?.url ?? '',
          type: x?.file_type ?? '',
          name: x?.file_name ?? '',
        }))
        .filter((x) => !!x.url);
    },
  });

  if (!enabled || isPending || isLoading) {
    return (
      <div className={`text-sm text-gray-400 ${className}`}>로딩중...</div>
    );
  }

  // 에러 발생 시
  if (isError) {
    console.warn(
      '[SuggestionImagesByUrl] 목록 조회 실패:',
      error?.response?.data || error?.message,
    );
    return fallback;
  }

  // 이미지가 없을 때
  if (images.length === 0) {
    return fallback;
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
