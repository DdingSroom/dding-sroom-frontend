type CommunityDateArray = number[];

type GetPostPreviewViewModelParams = {
  category: number;
  createdAt?: CommunityDateArray;
};

const HOUR_IN_MS = 1000 * 60 * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;

const CATEGORY_NAME: Record<number, string> = {
  1: '일반 게시판',
  2: '분실물 게시판',
};

const parseCommunityDate = (dateArray?: CommunityDateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) {
    return null;
  }

  const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
  return new Date(year, month - 1, day, hour, minute, second);
};

const formatCreatedAtText = (
  dateArray: CommunityDateArray | undefined,
  date: Date | null,
) => {
  if (!date || !dateArray) {
    return '';
  }

  const diffInMs = Math.max(0, Date.now() - date.getTime());
  const diffInHours = diffInMs / HOUR_IN_MS;
  const diffInDays = diffInMs / DAY_IN_MS;

  if (diffInHours < 24) {
    if (diffInHours < 1) {
      return `${Math.floor(diffInMs / (1000 * 60))}분 전`;
    }

    return `${Math.floor(diffInHours)}시간 전`;
  }

  if (diffInDays < 30) {
    return `${Math.floor(diffInDays)}일 전`;
  }

  const [year, month, day] = dateArray;
  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
};

export const getPostPreviewViewModel = ({
  category,
  createdAt,
}: GetPostPreviewViewModelParams) => {
  const parsedCreatedAt = parseCommunityDate(createdAt);

  return {
    categoryName: CATEGORY_NAME[category] ?? '알 수 없는 게시판',
    createdAtDateTime: parsedCreatedAt?.toISOString() ?? '',
    createdAtText: formatCreatedAtText(createdAt, parsedCreatedAt),
  };
};
