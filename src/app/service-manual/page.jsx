// src/app/service-manual/page.jsx
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: '서비스 이용 가이드 | 띵스룸(ddingsroom)',
  description:
    '명지대 띵스룸(ddingsroom) 서비스 이용 안내(회원가입, 비밀번호 재설정, 로그인, 홈, 마이페이지, 운영방침, 자주 묻는 질문)',
  robots: { index: true, follow: true },
  openGraph: {
    title: '서비스 이용 가이드 | 띵스룸(ddingsroom)',
    description: '처음 사용자도 쉽게 따라 할 수 있는 이용 가이드',
    url: '/service-manual',
    type: 'article',
  },
};

const updatedAt = '2025-08-14 (KST)';

export default function ServiceManualPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-[#788cff]">
          띵스룸 이용 가이드
        </h1>
        <p className="mt-2 text-sm text-[#6a7cb0]">
          마지막 업데이트: <time dateTime="2025-08-14">{updatedAt}</time>
        </p>

        <p className="mt-6 rounded-2xl border border-[#dbe5ff] bg-white/70 p-5 leading-[1.9] text-[15px] text-[#37352f]">
          띵스룸은 <b>명지대학교 학생 전용 스터디룸 예약 서비스</b>입니다. 처음
          방문하신 분도 이 문서만 따라 하면 <b>회원가입 → 로그인 → 예약</b>까지
          어렵지 않게 완료할 수 있어요. 각 단계별 화면 캡처와 주의사항, 자주
          겪는 문제 해결법을 함께 제공해요.
        </p>

        <QuickStart />
      </header>

      <div className="mb-8 h-px w-full bg-[#e9e9e7]" />

      {/* TOC */}
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
            ['#section-signup', '회원가입'],
            ['#section-reset', '비밀번호 재설정'],
            ['#section-login', '로그인'],
            ['#section-home', '홈(예약하기)'],
            ['#section-mypage', '마이페이지'],
            ['#section-policy', '운영방침'],
            ['#section-faq', '자주 묻는 질문(FAQ)'],
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

      {/* Content */}
      <article className="space-y-10">
        {/* 회원가입 */}
        <Section id="section-signup" title="1. 회원가입">
          <SubTitle>1) 화면 미리보기</SubTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ImgCard
              src="/manual/signup-step1.png"
              alt="회원가입 Step 1 - 학교 이메일 입력"
              caption="① 학교 이메일 입력 후 ‘인증번호 보내기’"
            />
            <ImgCard
              src="/manual/signup-step2.png"
              alt="회원가입 Step 2 - 인증번호 확인"
              caption="② 메일로 받은 6자리 인증번호 입력"
            />
            <ImgCard
              src="/manual/signup-step3.png"
              alt="회원가입 Step 3 - 비밀번호 설정"
              caption="③ 닉네임/비밀번호 설정"
            />
            <ImgCard
              src="/manual/signup-complete.png"
              alt="회원가입 완료 화면"
              caption="④ 가입 완료 → 로그인으로 이동"
            />
          </div>

          <SubTitle>2) 따라하기</SubTitle>
          <OL>
            <Step title="학교 이메일 입력">
              <b>@mju.ac.kr</b> 주소를 입력하고 <b>인증번호 보내기</b>를
              누르세요.
            </Step>
            <Step title="메일함 확인">
              받은메일함 또는 <b>스팸함</b>에서 인증번호(6자리)를 확인하세요.
            </Step>
            <Step title="인증번호 입력">
              화면에 인증번호를 입력 후 <b>확인</b>을 누릅니다.
            </Step>
            <Step title="프로필/비밀번호 설정">
              닉네임과 비밀번호를 규칙에 맞게 설정하면 가입이 완료됩니다.
            </Step>
          </OL>

          <SubTitle>3) 알아두면 좋아요</SubTitle>
          <Callout type="info" title="인증 메일이 안 와요">
            1–3분 정도 걸릴 수 있어요. 스팸함도 확인해 주세요. 그래도 없다면{' '}
            <b>재전송</b> 버튼을 눌러 다시 받아보세요.
          </Callout>
          <Callout type="warn" title="비밀번호 규칙">
            최소 8자 이상, <b>영문 + 숫자 + 특수문자</b>를 포함하면 대부분
            통과돼요.
          </Callout>

          <SubTitle>4) 자주 발생하는 오류</SubTitle>
          <UL>
            <LI>
              <b>인증번호 불일치</b> → 숫자 6자리를 정확히 입력했는지 확인 후{' '}
              <b>재전송</b>으로 새 번호 받기
            </LI>
            <LI>
              <b>이미 가입된 이메일</b> →{' '}
              <Link
                className="text-[#788cff] underline"
                href="/login/reset-password-step1"
              >
                비밀번호 재설정
              </Link>{' '}
              으로 진행
            </LI>
          </UL>
        </Section>

        {/* 비밀번호 재설정 */}
        <Section id="section-reset" title="2. 비밀번호 재설정">
          <SubTitle>1) 화면 미리보기</SubTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ImgCard
              src="/manual/reset-step1.png"
              alt="비밀번호 재설정 Step 1"
              caption="① 이메일 입력 후 인증번호 요청"
            />
            <ImgCard
              src="/manual/reset-step2.png"
              alt="비밀번호 재설정 Step 2"
              caption="② 받은 인증번호 입력"
            />
            <ImgCard
              src="/manual/reset-step3.png"
              alt="비밀번호 재설정 Step 3"
              caption="③ 새 비밀번호 설정"
            />
            <ImgCard
              src="/manual/reset-complete.png"
              alt="비밀번호 재설정 완료"
              caption="④ 변경 완료 → 로그인으로 이동"
            />
          </div>

          <SubTitle>2) 따라하기</SubTitle>
          <OL>
            <Step title="이메일 입력">가입했던 학교 이메일을 입력합니다.</Step>
            <Step title="인증번호 확인">
              메일로 받은 인증번호를 입력합니다.
            </Step>
            <Step title="새 비밀번호 설정">
              새 비밀번호 두 칸이 <b>서로 동일</b>한지 확인하고 저장하세요.
            </Step>
          </OL>

          <SubTitle>3) 자주 막히는 부분</SubTitle>
          <UL>
            <LI>
              <b>유효시간 초과</b> → 인증번호를 다시 요청해서 새 번호로
              진행하세요.
            </LI>
            <LI>
              <b>비밀번호 불일치</b> → 두 칸의 값이 같은지 확인하고 다시
              입력하세요.
            </LI>
          </UL>
        </Section>

        {/* 로그인 */}
        <Section id="section-login" title="3. 로그인">
          <SubTitle>1) 화면 미리보기</SubTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ImgCard
              src="/manual/login-main.png"
              alt="로그인 화면"
              caption="이메일/비밀번호 입력 후 로그인"
            />
            <ImgCard
              src="/manual/login-error.png"
              alt="로그인 오류 예시"
              caption="자격 증명 불일치 시 안내"
            />
          </div>

          <SubTitle>2) 따라하기</SubTitle>
          <OL>
            <Step title="이메일/비밀번호 입력">
              회원가입 때 사용한 정보로 입력하세요.
            </Step>
            <Step title="로그인 버튼">성공하면 홈으로 이동합니다.</Step>
            <Step title="비밀번호를 잊었나요?">
              <Link
                className="text-[#788cff] underline"
                href="/login/reset-password-step1"
              >
                비밀번호 재설정
              </Link>
              로 초기화할 수 있어요.
            </Step>
          </OL>

          <SubTitle>3) 자주 발생하는 오류</SubTitle>
          <UL>
            <LI>대소문자/공백을 확인하고 다시 입력해 보세요.</LI>
            <LI>네트워크 불안정 시 잠시 후 다시 시도해 주세요.</LI>
          </UL>
        </Section>

        {/* 홈(예약) */}
        <Section id="section-home" title="4. 홈(예약하기)">
          <SubTitle>1) 화면 미리보기</SubTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ImgCard
              src="/manual/home-today.png"
              alt="오늘 예약 탭"
              caption="오늘 예약하기"
            />
            <ImgCard
              src="/manual/home-tomorrow.png"
              alt="내일 예약 탭"
              caption="내일 예약하기"
            />
            <ImgCard
              src="/manual/home-legend.png"
              alt="타임 슬롯 안내"
              caption="색상 안내(예약 가능/예약됨/지난 시간)"
            />
            <ImgCard
              src="/manual/home-modal.png"
              alt="예약 확인 모달"
              caption="선택한 시간 확인 후 예약 확정"
            />
          </div>

          <SubTitle>2) 따라하기</SubTitle>
          <OL>
            <Step title="날짜 선택">
              상단에서 <b>오늘/내일</b> 중 선택합니다.
            </Step>
            <Step title="시간대 확인">
              홈 화면의 <b>예약 상태별 색상</b>을 확인하고 원하는 시간대를
              고릅니다. 시간대 영역은 <b>가로 스크롤</b>이 가능합니다.
            </Step>
            <Step title="예약하기 버튼">
              원하는 방에서 <b>예약</b> 버튼을 눌러 <b>시작 시간</b>과{' '}
              <b>종료 시간</b>을 선택합니다.
            </Step>
            <Step title="최종 확인">
              내용(날짜/방/시간)을 다시 체크하고 <b>예약하기</b>를 누르면
              완료됩니다.
            </Step>
          </OL>

          <SubTitle>3) 색상 안내 & 주의</SubTitle>
          <Callout type="info" title="색상 안내">
            검정: 지난 시간 / 회색: 예약됨 / 파랑: 예약 가능
          </Callout>
          <Callout type="warn" title="중복 예약 방지">
            같은 시간대에는 <b>중복 예약이 불가</b>합니다. 이미 회색(예약됨)인지
            먼저 확인해 주세요.
          </Callout>
        </Section>

        {/* 마이페이지 */}
        <Section id="section-mypage" title="5. 마이페이지">
          <SubTitle>1) 화면 미리보기</SubTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ImgCard
              src="/manual/mypage-profile.png"
              alt="마이페이지 프로필 화면"
              caption="계정 정보/로그아웃/회원탈퇴"
            />
            <ImgCard
              src="/manual/mypage-reservations.png"
              alt="예약 내역 화면"
              caption="과거/현재/미래 예약 조회 및 취소"
            />
            <ImgCard
              src="/manual/mypage-cancel-modal.png"
              alt="예약 취소 모달"
              caption="예약 취소 확인"
            />
            <ImgCard
              src="/manual/mypage-privacy.png"
              alt="정책/문의 링크"
              caption="개인정보처리방침/문의"
            />
          </div>

          <SubTitle>2) 할 수 있는 것</SubTitle>
          <UL>
            <LI>내 예약 내역 보기/취소하기</LI>
            <LI>닉네임/비밀번호 변경, 로그아웃, 회원탈퇴</LI>
          </UL>

          <SubTitle>3) 참고 사항</SubTitle>
          <UL>
            <LI>시작 시간이 지난 예약은 취소가 제한될 수 있어요.</LI>
            <LI>
              취소 직후 목록 반영이 늦으면 <b>새로고침</b>해 주세요.
            </LI>
          </UL>
        </Section>

        {/* 운영방침 */}
        <Section id="section-policy" title="6. 운영방침">
          <P className="mb-2">
            보다 공정하고 원활한 이용을 위해 아래 원칙을 운영합니다.
          </P>
          <OL>
            <Step title="이용 대상">
              <b>1인 이상이면 누구나</b> 예약 및 이용이 가능합니다.
            </Step>
            <Step title="일일 이용 한도">
              <b>학생 1인당 하루 최대 2시간</b>까지 예약/이용할 수 있습니다.
            </Step>
            <Step title="예약 단위 및 중복 예약">
              예약은 <b>1시간 또는 2시간 단위</b>로 가능합니다. 같은
              스터디룸에서
              <b>첫 예약 종료시간에 맞추어 1시간씩 따로 예약</b>하는 방식은
              시스템에서 <b>중복 예약으로 간주</b>되어 <b>예약이 불가</b>합니다.
              <br />
              <span className="text-[#73726e] text-sm">
                (같은 스터디룸을 계속 이용하시려면 <b>2시간을 한 번에</b>{' '}
                예약해주세요.)
              </span>
            </Step>
          </OL>
          <Callout type="info" title="예시">
            13:00~14:00, 14:00~15:00을 같은 방에서 따로 예약하려고 시도하면
            중복으로 체크되어 실패합니다. 이 경우 13:00~15:00(2시간)을 한 번에
            예약해 주세요.
          </Callout>
        </Section>

        {/* FAQ */}
        <Section id="section-faq" title="7. 자주 묻는 질문(FAQ)">
          <MiniTitle>Q1. 인증 메일이 오지 않아요.</MiniTitle>
          <P>
            스팸함을 확인하고, 3분 이상 지나도 없다면 <b>재전송</b>을 눌러 새로
            받아 보세요. 학교 메일 수신 지연이 있을 수 있습니다.
          </P>

          <MiniTitle>Q2. 비밀번호 규칙이 무엇인가요?</MiniTitle>
          <P>
            최소 8자 이상, <b>영문 + 숫자 + 특수문자</b>를 섞어 주세요.
          </P>

          <MiniTitle>Q3. 예약은 몇 분 단위로 가능한가요?</MiniTitle>
          <P>
            시간 선택은 10분 단위로 가능하며, 실제 예약은{' '}
            <b>1시간 또는 2시간</b> 단위로 확정됩니다.
          </P>

          <MiniTitle>Q4. 예약이 안 될 때는 어떻게 하나요?</MiniTitle>
          <P>
            이미 회색(예약됨) 시간인지 확인하고, 네트워크 상태가 불안정하면 다시
            시도해 주세요. 계속 실패하면 아래 문의처로 알려 주세요.
          </P>

          <MiniTitle>Q5. 문의는 어디로 하나요?</MiniTitle>
          <P>
            <Link
              href="/privacy-policy"
              className="text-[#788cff] underline underline-offset-4"
            >
              개인정보처리방침
            </Link>
            하단의 이메일로 문의해 주세요.
          </P>
        </Section>
      </article>

      {/* back to top / divider / home */}
      <div className="mt-14 flex items-center justify-end">
        <a
          href="#"
          className="inline-flex items-center rounded-xl border border-[#788cff] px-4 py-2 text-sm font-medium text-[#788cff] hover:bg-gray-50 transition"
          aria-label="맨 위로 이동"
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

/* ========== 빠른 시작 ========== */
function QuickStart() {
  return (
    <div className="mt-6 rounded-2xl border border-[#e4e9ff] bg-[#f9fbff] p-5">
      <h2 className="text-sm font-semibold text-[#788cff] mb-3">
        5분 만에 시작하기
      </h2>
      <ol className="list-decimal pl-5 space-y-2 text-[15px] leading-[1.9]">
        <li>
          <Link
            href="/login/sign-up-step1"
            className="text-[#788cff] underline"
          >
            학교 이메일로 회원가입
          </Link>{' '}
          (인증번호 확인)
        </li>
        <li>
          <Link href="/login" className="text-[#788cff] underline">
            로그인
          </Link>{' '}
          후 홈으로 이동
        </li>
        <li>원하는 방과 시간을 선택해 예약 완료</li>
        <li>마이페이지에서 예약 내역 확인/취소</li>
      </ol>
    </div>
  );
}

/* ========== Reusable UI ========== */

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

function OL({ children }) {
  return (
    <ol className="list-decimal pl-5 sm:pl-6 space-y-2.5 text-[15px] leading-[1.95]">
      {children}
    </ol>
  );
}

function LI({ children }) {
  return <li className="marker:text-[#788cff]">{children}</li>;
}

function Step({ title, children }) {
  return (
    <LI>
      <span className="font-semibold text-[#37352f]">{title}</span>
      <span className="ml-1">{children}</span>
    </LI>
  );
}

function ImgCard({ src, alt, caption }) {
  return (
    <figure className="rounded-2xl border border-[#e9e9e7] bg-white overflow-hidden">
      <div className="relative w-full h-52 sm:h-64">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={false}
        />
      </div>
      <figcaption className="p-3 text-xs text-[#73726e]">{caption}</figcaption>
    </figure>
  );
}

function Callout({ type = 'info', title, children }) {
  const styles =
    type === 'info'
      ? 'border-[#dbe5ff] bg-[#f7faff]'
      : 'border-[#ffe3bf] bg-[#fff9f0]';
  const badge =
    type === 'info' ? (
      <span className="rounded-md bg-[#e7efff] text-[#4361ee] px-2 py-0.5 text-[11px] font-semibold">
        TIP
      </span>
    ) : (
      <span className="rounded-md bg-[#fff0d9] text-[#ad6200] px-2 py-0.5 text-[11px] font-semibold">
        주의
      </span>
    );

  return (
    <div
      className={`rounded-2xl border ${styles} p-4 text-[14px] leading-[1.9]`}
    >
      <div className="mb-1 flex items-center gap-2">
        {badge}
        <span className="font-semibold">{title}</span>
      </div>
      <div className="text-[#37352f]">{children}</div>
    </div>
  );
}
