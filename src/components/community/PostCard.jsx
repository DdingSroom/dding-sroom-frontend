'use client';

import { useRouter } from 'next/navigation';

const PostCard = ({ post }) => {
  const router = useRouter();

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray)) return '';
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour || 0, minute || 0);

    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes}분 전`;
      }
      return `${Math.floor(diffInHours)}시간 전`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays)}일 전`;
    } else {
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    }
  };

  const getCategoryName = (category) => {
    return category === 1 ? '일반게시판' : '분실물게시판';
  };

  const getCategoryColor = () => {
    return 'text-[#788cff]';
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleClick = () => {
    router.push(`/community/${post.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-xl p-5 mb-4 cursor-pointer hover:shadow-md hover:border-[#788cff]/20 transition-all duration-200 group"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(post.category)} bg-[#788cff]/10 group-hover:bg-[#788cff]/15 transition-colors`}
        >
          {getCategoryName(post.category)}
        </div>
        <div className="text-xs text-[#9b9998]">
          {formatDate(post.created_at)}
        </div>
      </div>

      <h3 className="text-base font-bold text-[#37352f] mb-3 leading-relaxed group-hover:text-[#788cff] transition-colors line-clamp-2">
        {post.title}
      </h3>

      <p className="text-sm text-[#73726e] leading-relaxed line-clamp-3">
        {truncateContent(post.content, 100)}
      </p>
    </div>
  );
};

export default PostCard;
