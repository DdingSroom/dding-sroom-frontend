export const parseCrowdingCount = (message: unknown): number | null => {
  if (typeof message !== 'string' || !/^\d+$/.test(message)) {
    return null;
  }
  return Number(message);
};

export const getCrowdingText = (count: number | null): string =>
  count === null ? '확인 불가' : `이용 중 ${count}곳`;
