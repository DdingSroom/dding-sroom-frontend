import './globals.css';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://ddingsroom.com'),
  title: 'DdingsRoom | 명지대학교 학생회관 스터디룸 예약 서비스',
  description:
    '명지대학교 인문캠퍼스 학생회관 스터디룸 예약부터 사용까지! 간편한 온라인 예약 시스템으로 언제든지 스터디룸을 예약하세요.',
  keywords: [
    '명지대학교',
    '스터디룸',
    '예약',
    '학생회관',
    '인문캠퍼스',
    '띵스룸',
    'DdingsRoom',
  ],
  authors: [{ name: 'DdingsRoom Team' }],
  creator: 'DdingsRoom',
  publisher: 'DdingsRoom',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'DdingsRoom | 명지대학교 학생회관 스터디룸 예약 서비스',
    description:
      '명지대학교 인문캠퍼스 학생회관 스터디룸 예약부터 사용까지! 간편한 온라인 예약 시스템으로 언제든지 스터디룸을 예약하세요.',
    url: 'https://ddingsroom.com',
    siteName: 'DdingsRoom',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/static/images/ddingsroom.png',
        width: 1200,
        height: 630,
        alt: 'DdingsRoom 서비스 대표 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DdingsRoom | 명지대학교 학생회관 스터디룸 예약 서비스',
    description: '명지대학교 인문캠퍼스 학생회관 스터디룸 예약부터 사용까지!',
    images: ['/static/images/ddingsroom.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6XKZ627HGM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6XKZ627HGM');
          `}
        </Script>
      </body>
    </html>
  );
}
