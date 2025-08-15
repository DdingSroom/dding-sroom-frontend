import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'DdingsRoom | 명지대학교 학생회관 스터디룸 예약 서비스',
  description: '명지대학교 인문캠퍼스 학생회관 스터디룸 예약부터 사용까지!',
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
