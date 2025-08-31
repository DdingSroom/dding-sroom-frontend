'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '../../libs/api/instance';

export default function ProtectedImage({
  suggestPostId,
  className = '',
  alt = '첨부 이미지',
  fallback = (
    <div className="h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400">
      이미지 없음
    </div>
  ),
}) {
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!suggestPostId) {
      setLoading(false);
      setError(true);
      return;
    }

    let urlToRevoke = '';
    const ac = new AbortController();

    const sniffMime = (buf) => {
      try {
        const b = new Uint8Array(buf);
        // JPEG FF D8 FF
        if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff)
          return 'image/jpeg';
        // PNG 89 50 4E 47
        if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
          return 'image/png';
        // GIF 47 49 46 38
        if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38)
          return 'image/gif';
        // WEBP: "RIFF....WEBP"
        const riff = String.fromCharCode(b[0], b[1], b[2], b[3]) === 'RIFF';
        const webp = String.fromCharCode(b[8], b[9], b[10], b[11]) === 'WEBP';
        if (riff && webp) return 'image/webp';
      } catch (e) {
        // error
      }
      return '';
    };

    async function load() {
      setLoading(true);
      setError(false);
      setSrc('');

      try {
        const res = await axiosInstance.get('/api/suggestions/images', {
          params: { suggest_post_id: suggestPostId },
          responseType: 'arraybuffer',
          headers: { Accept: 'image/*, */*' },
          signal: ac.signal,
        });

        const buf = res.data;
        const headerCT =
          (res.headers &&
            (res.headers['content-type'] || res.headers['Content-Type'])) ||
          '';
        const inferred = sniffMime(buf);
        const mime =
          (headerCT && headerCT.startsWith('image/') && headerCT) ||
          inferred ||
          'application/octet-stream';

        if (!mime.startsWith('image/')) {
          const preview = new TextDecoder().decode(
            new Uint8Array(buf).slice(0, 200),
          );
          console.warn('[ProtectedImage] not an image. first bytes:', preview);
        }

        const blob = new Blob([buf], { type: mime });
        const objUrl = URL.createObjectURL(blob);
        urlToRevoke = objUrl;
        setSrc(objUrl);
        setError(false);
      } catch (e) {
        if (!ac.signal.aborted) {
          console.error('[ProtectedImage] load failed', {
            status: e?.response?.status,
            data: e?.response?.data,
            message: e?.message,
          });
          setError(true);
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }

    load();

    return () => {
      ac.abort();
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
    };
  }, [suggestPostId]);

  if (loading) {
    return (
      <div
        className={`h-24 bg-gray-100 rounded animate-pulse flex items-center justify-center text-gray-400 ${className}`}
      >
        로딩중...
      </div>
    );
  }

  if (error || !src) return fallback;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        console.warn('Image load error for suggest_post_id:', suggestPostId);
        setError(true);
      }}
    />
  );
}
