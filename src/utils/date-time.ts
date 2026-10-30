export type DateTimeParts = [
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
];

const DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/;

export const parseDateTimeParts = (value: unknown): DateTimeParts | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const match = DATE_TIME_PATTERN.exec(value);
  if (!match) {
    return null;
  }

  const [, year, month, day, hour = '0', minute = '0', second = '0'] = match;
  return [
    Number(year),
    Number(month),
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  ];
};

// 정렬 비교용 숫자 값 (형식 오류는 0으로 두어 가장 과거로 정렬, 비교 결과 NaN 방지)
export const toDateTimeSortValue = (value: unknown): number => {
  const parts = parseDateTimeParts(value);
  if (!parts) {
    return 0;
  }

  const [year, month, day, hour, minute, second] = parts;
  return Date.UTC(year, month - 1, day, hour, minute, second);
};
