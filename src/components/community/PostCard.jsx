'use client';

import { useRouter } from 'next/navigation';

const PostCard = ({ post }) => {
  const router = useRouter();

  const formatDate = (arr) => {
    if (!Array.isArray(arr)) return '';
    const [y, m, d, h, min] = arr;
    const date = new Date(y, (m || 1) - 1, d || 1, h || 0, min || 0);
    const now = new Date();
    const diff = now - date;
    const hrs = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);
    if (hrs < 24)
      return hrs < 1
        ? `${Math.floor(diff / (1000 * 60))}분 전`
        : `${Math.floor(hrs)}시간 전`;
    if (days < 30) return `${Math.floor(days)}일 전`;
    return `${y}.${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`;
  };

  const getCategoryName = (c) => (c === 1 ? '일반 게시판' : '분실물 게시판');

  return (
    <article
      onClick={() => router.push(`/community/${post.id}`)}
      className="cursor-pointer select-none bg-white px-4 py-3 border-b border-gray-200 active:bg-gray-50"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs text-[#788DFF] font-medium mb-1">
            {getCategoryName(post.category)}
          </div>
          <h3 className="text-[15px] font-medium text-gray-900 leading-snug line-clamp-1">
            {post.title}
          </h3>
          <p className="text-[13px] text-gray-600 line-clamp-1 mt-0.5">
            {post.content}
          </p>
        </div>
        <time className="ml-3 text-[12px] text-gray-400 whitespace-nowrap">
          {formatDate(post.created_at)}
        </time>
      </div>
    </article>
  );
};

export default PostCard;
