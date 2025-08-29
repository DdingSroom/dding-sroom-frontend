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
      className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6 cursor-pointer hover:shadow-xl hover:shadow-[#788cff]/10 hover:bg-white/90 hover:border-[#788cff]/30 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 group touch-manipulation"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-full text-xs font-bold ${getCategoryColor(post.category)} bg-gradient-to-r from-[#788cff]/10 to-[#788cff]/5 group-hover:from-[#788cff]/20 group-hover:to-[#788cff]/10 transition-all duration-300 border border-[#788cff]/20`}
          >
            {getCategoryName(post.category)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-xs text-[#9b9998] font-medium">
            {formatDate(post.created_at)}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#9b9998]">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9H3V11H21V9M12 4L15 7H9L12 4Z" />
            </svg>
            글쓴이
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-[#37352f] mb-3 leading-relaxed group-hover:text-[#788cff] transition-colors line-clamp-2">
        {post.title}
      </h3>

      <p className="text-sm text-[#73726e] leading-relaxed line-clamp-3 mb-4">
        {truncateContent(post.content, 120)}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100/50">
        <div className="flex items-center gap-4 text-xs text-[#9b9998]">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z\" />
            </svg>
            \ub313\uae00
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
            </svg>
            조회
          </div>
        </div>
        <div className="text-xs text-[#788cff] font-medium group-hover:text-[#6a7dff] transition-colors">
          \uc790\uc138\ud788 \ubcf4\uae30 \u2192
        </div>
      </div>
    </div>
  );
};

export default PostCard;
