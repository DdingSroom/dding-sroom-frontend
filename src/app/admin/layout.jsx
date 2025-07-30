export const metadata = {
  title: 'DdingsRoom 관리자',
  description: '명지대학교 스터디룸 관리자 페이지',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="ko">
      <body className="admin-body">
        <body className="bg-[#F5F5F5] min-h-screen overflow-x-hidden">
          <div className="w-full min-h-screen bg-[#F5F5F5] flex">
            <aside className="w-64 bg-white border-r p-6 hidden md:flex flex-col">
              <h1 className="text-xl font-bold mb-8">사이트 관리</h1>
              <nav className="flex flex-col gap-4 text-sm text-gray-700">
                <a
                  href="/admin/dashboard"
                  className="text-[#5B72EE] font-semibold"
                >
                  대시보드
                </a>
                <a href="/admin/user-management">사용자 관리</a>
                <a href="#">예약</a>
                <a href="#">커뮤니티 관리</a>
                <a href="#">건의내역</a>
              </nav>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto">{children}</main>
          </div>

          {/* 모바일 접근 제한 */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              if (window.innerWidth < 768) {
                alert('관리자 페이지는 데스크탑에서만 접속 가능합니다.');
                window.location.href = '/';
              }
            `,
            }}
          />
        </body>
      </body>
    </html>
  );
}
