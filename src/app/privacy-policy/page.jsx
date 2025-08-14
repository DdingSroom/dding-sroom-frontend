import Link from 'next/link';

export const metadata = {
  title: '개인정보처리방침 | 띵스룸(ddingsroom)',
  description:
    '명지대 띵스룸(ddingsroom) 서비스의 개인정보 수집·이용·보관·파기 및 이용자 권리 보호 안내',
  robots: { index: true, follow: true },
  openGraph: {
    title: '개인정보처리방침 | 띵스룸(ddingsroom)',
    description: '명지대 띵스룸(ddingsroom) 서비스의 개인정보 처리 안내',
    url: '/privacy-policy',
    type: 'article',
  },
};

const updatedAt = '2025-08-14 (KST)';

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-[#788cff]">
          개인정보처리방침
        </h1>
        <p className="mt-2 text-sm text-[#6a7cb0]">
          마지막 업데이트: <time dateTime="2025-08-14">{updatedAt}</time>
        </p>

        <p className="mt-6 rounded-2xl border border-[#dbe5ff] bg-white/70 p-5 leading-[1.9] text-[15px] text-[#37352f]">
          본 개인정보처리방침은 명지대 띵스룸(ddingsroom) 서비스가 이용자들의
          개인정보를 어떻게 수집·이용·보관·파기하는지, 그리고 이용자의 권리를
          어떻게 보호하는지를 설명합니다. 본 방침은 서비스 이용 시 적용되는
          기준입니다.
        </p>
      </header>

      <div className="mb-8 h-px w-full bg-[#e9e9e7]" />

      <nav
        aria-label="문서 목차"
        className="mb-12 rounded-2xl border border-[#dbe5ff] bg-white/70 p-5"
      >
        <h2 className="text-sm font-semibold text-[#788cff] mb-3">목차</h2>
        <ol
          className="list-decimal ml-5 space-y-2 text-[15px]"
          style={{ color: '#788cff' }}
        >
          {[
            ['#section-1', '개인정보 수집 항목 및 수집 방법'],
            ['#section-2', '개인정보의 이용 목적'],
            ['#section-3', '개인정보의 보관 및 파기'],
            ['#section-4', '개인정보 제3자 제공 및 위탁'],
            ['#section-5', '이용자의 권리와 행사 방법'],
            ['#section-6', '개인정보 보호를 위한 기술적/관리적 방침'],
            ['#section-7', '개인정보처리방침의 변경'],
            ['#section-8', '문의처'],
          ].map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                className="text-[#788cff] hover:underline underline-offset-4"
              >
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article className="space-y-10">
        <Section id="section-1" title="1. 개인정보 수집 항목 및 수집 방법">
          <SubTitle>1) 수집하는 개인정보 항목</SubTitle>
          <P>서비스에서는 아래와 같은 개인정보 항목을 필수적으로 수집합니다.</P>

          <MiniTitle>가. 회원가입 및 예약 서비스 이용</MiniTitle>
          <UL>
            <LI>성명(닉네임, 사용자명)</LI>
            <LI>이메일 주소(학교메일 인증)</LI>
            <LI>비밀번호</LI>
            <LI>회원 가입일자(등록일)</LI>
            <LI>사용자 역할, 상태정보(role, state)</LI>
          </UL>

          <MiniTitle>나. 예약 관련 정보</MiniTitle>
          <UL>
            <LI>예약한 스터디룸 번호, 예약시각, 이용 시작/종료시간</LI>
            <LI>예약 현황, 예약 상태</LI>
            <LI>예약 생성 및 갱신 일시</LI>
          </UL>

          <MiniTitle>다. 서비스 이용 기록</MiniTitle>
          <UL>
            <LI>스터디룸 이용내역, 예약내역</LI>
            <LI>건의내역, 신고내역</LI>
            <LI>기타 서비스 개선을 위한 피드백 내역</LI>
          </UL>

          <SubTitle>2) 수집 방법</SubTitle>
          <UL>
            <LI>회원 가입 시 직접 입력(학교 이메일 인증 절차 포함)</LI>
            <LI>예약 및 서비스 이용 과정에서 자동 수집</LI>
            <LI>불편사항 건의 시 직접 입력</LI>
          </UL>
        </Section>

        <Section id="section-2" title="2. 개인정보의 이용 목적">
          <UL>
            <LI>
              <b>회원 식별 및 관리</b>: 회원 가입, 본인 인증 및 식별, 회원 탈퇴,
              서비스 부정 이용 방지 등
            </LI>
            <LI>
              <b>스터디룸 예약 및 관리</b>: 예약 내역 확인, 이용시간 관리, 예약
              현황 통계 분석
            </LI>
            <LI>
              <b>서비스 개선 및 사용자 피드백 반영</b>: 예약 행태 데이터
              분석(예: 특정 시간대 예약 쏠림 현상 등), 사용자 불편사항 접수 및
              처리
            </LI>
            <LI>
              <b>관리자 기능</b>: 사용자/예약 내역 실시간 관리 및 공지사항 전달
            </LI>
          </UL>
        </Section>

        <Section id="section-3" title="3. 개인정보의 보관 및 파기">
          <SubTitle>1) 보관 기간</SubTitle>
          <UL>
            <LI>
              회원탈퇴 요청 시, 회원 식별정보 및 예약 관련 데이터(예약내역,
              이용기록 등)는 관련 법령을 준수하여 <b>1개월 이내</b> 모두
              삭제됩니다.
            </LI>
            <LI>
              피드백 및 건의사항 기록은 서비스 개선 목적에 한해 일정 기간 보관할
              수 있으나, 회원 정보와 직접 결합된 정보는 1개월 내 완전
              삭제합니다.
            </LI>
          </UL>

          <SubTitle>2) 파기 절차 및 방법</SubTitle>
          <UL>
            <LI>
              보관 기한 도래 또는 계정 탈퇴 요청 시, 데이터는 장기 보관하지
              않으며 <b>복구 불가능한 방식</b>으로 삭제합니다.
            </LI>
            <LI>예약 데이터 및 이용기록 또한 동일한 방식으로 파기합니다.</LI>
          </UL>
        </Section>

        <Section id="section-4" title="4. 개인정보 제3자 제공 및 위탁">
          <P>
            띵스룸 서비스는 이용자의 동의 없이 개인정보를 외부에 제공하지
            않으며,{' '}
            <b>내부 서비스 운영, 개발 및 관리 목적 외에는 사용하지 않습니다.</b>{' '}
            단, 관련 법령에서 요구하거나 수사기관의 적법한 절차에 따른 요청이
            있을 경우 예외적으로 제공될 수 있습니다.
          </P>
          <P>
            예약 현황 통계(예: 특정 시간대 예약 집중) 등 익명화된 데이터는
            서비스 개선 목적으로 분석에 활용될 수 있으나, 개인을 식별할 수 있는
            정보와는 <b>절대 결합하지 않습니다.</b>
          </P>
        </Section>

        <Section id="section-5" title="5. 이용자의 권리와 행사 방법">
          <UL>
            <LI>
              회원은 언제든지 자신의 개인정보를 조회/수정/삭제할 수 있습니다.
            </LI>
            <LI>
              탈퇴 요청 시, 모든 개인정보와 예약 내역은 <b>1개월 이내</b> 완전
              삭제됩니다.
            </LI>
            <LI>
              개인정보 열람, 정정, 삭제, 처리정지 등 각종 권리는 서비스 내
              ‘마이페이지’ 또는 띵스룸 서비스 문의를 통해 행사할 수 있습니다.
            </LI>
          </UL>
        </Section>

        <Section
          id="section-6"
          title="6. 개인정보 보호를 위한 기술적/관리적 방침"
        >
          <UL>
            <LI>접근 권한 통제 및 인증된 관리자만 접근 가능하도록 관리</LI>
            <LI>
              중요 정보(비밀번호 등)는 복호화 불가능한 방식으로 암호화 저장
            </LI>
            <LI>불법 접근 방지를 위한 상시 모니터링 및 내부 점검 실시</LI>
            <LI>
              관리자 페이지 접근 권한 관리, 로그인이력/주요 기록 별도 관리
            </LI>
          </UL>
        </Section>

        <Section id="section-7" title="7. 개인정보처리방침의 변경">
          <P>
            서비스 정책, 법령 변경 등에 따라 본 방침은 사전 고지 후 변경될 수
            있습니다. 변경 시 서비스 내 공지사항 페이지를 통해 확인 가능합니다.
          </P>
        </Section>

        <Section id="section-8" title="8. 문의처">
          <P>
            개인정보 관련 문의사항 및 권리 행사 요청 시 아래로 연락해 주세요.
          </P>
          <UL>
            <LI>
              <b>이메일</b>:{' '}
              <a
                href="mailto:ddingsroom2025@mju.ac.kr"
                className="text-[#788cff] underline underline-offset-4 hover:opacity-80"
              >
                ddingsroom2025@mju.ac.kr
              </a>
            </LI>
            <LI>서비스 사이트 내 하단 정보 참고</LI>
          </UL>
        </Section>
      </article>

      <div className="mt-14 flex items-center justify-end">
        <a
          href="#"
          className="inline-flex items-center rounded-xl border border-[#788cff] px-4 py-2 text-sm font-medium text-[#788cff] hover:bg-gray-50 transition"
        >
          ↑ 맨 위로
        </a>
      </div>

      <div className="mt-10 h-px w-full bg-[#e9e9e7]" />

      <div className="mt-6 text-right text-xs text-[#73726e]">
        <Link
          href="/"
          className="hover:underline underline-offset-4 text-[#788cff]"
        >
          홈으로
        </Link>
      </div>
    </main>
  );
}

function Section({ id, title, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-2xl border border-[#e9e9e7] bg-white p-6 sm:p-7 leading-[1.95] text-[#37352f]"
    >
      <h2 className="text-[22px] sm:text-[24px] font-extrabold text-[#788cff] mb-5">
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function SubTitle({ children }) {
  return (
    <h3 className="text-[17px] font-bold text-[#788cff] mt-1">{children}</h3>
  );
}

function MiniTitle({ children }) {
  return (
    <h4 className="text-[15px] font-semibold text-[#6a7dff] mt-1">
      {children}
    </h4>
  );
}

function P({ children }) {
  return <p className="text-[15px] leading-[1.95]">{children}</p>;
}

function UL({ children }) {
  return (
    <ul className="list-disc pl-5 sm:pl-6 space-y-2.5 text-[15px] leading-[1.95]">
      {children}
    </ul>
  );
}

function LI({ children }) {
  return <li className="marker:text-[#788cff]">{children}</li>;
}
