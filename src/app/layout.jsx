import './globals.css';

export const metadata = {
  title: 'DdingsRoom | 명지대학교 학생회관 스터디룸 예약 서비스',
  description: '명지대학교 인문캠퍼스 학생회관 스터디룸 예약부터 사용까지!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
