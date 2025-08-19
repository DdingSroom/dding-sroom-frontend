'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '../../libs/api/instance';

export default function ThumbByUrl({
  suggestPostId,
  className = 'w-[64px] h-[64px] rounded-xl overflow-hidden shrink-0 bg-[#f3f4f6]',
  imgClassName = 'w-full h-full object-cover',
}) {
  const [url, setUrl] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
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
        const first = arr.find((x) => x?.file_url);
        if (mounted) setUrl(first?.file_url || '');
      } catch (e) {
        if (mounted) setUrl('');
      } finally {
        if (mounted) setLoaded(true);
      }
    }
    if (suggestPostId) load();
    return () => {
      mounted = false;
    };
  }, [suggestPostId]);

  if (!loaded) {
    return (
      <div
        className={`${className} animate-pulse flex items-center justify-center text-gray-300`}
      >
        …
      </div>
    );
  }
  if (!url) return null;

  return (
    <div className={className} title="첫 번째 첨부 이미지">
      <img src={url} alt="" className={imgClassName} />
    </div>
  );
}
