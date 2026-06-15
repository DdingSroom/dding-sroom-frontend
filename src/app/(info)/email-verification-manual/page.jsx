'use client';

// import Link from 'next/link';
import { useRouter } from 'next/navigation';

const updatedAt = '2026-06-15 (KST)';

export default function ManualContent() {
  const router = useRouter();

  return (
    <main className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 py-12">
      {/* 헤더 */}
      <header className="mb-10">
        <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-[#788cff]">
          학교 이메일 인증 매뉴얼
        </h1>
        <p className="mt-2 text-sm text-[#6a7cb0]">
          마지막 업데이트: <time dateTime="2025-08-19">{updatedAt}</time>
        </p>

        <p className="mt-6 rounded-2xl border border-[#dbe5ff] bg-white/70 p-5 leading-[1.9] text-[15px] text-[#37352f]">
          일부 학우분들이 학교 이메일 인증 메일을 받지 못하는 경우가 있습니다.
          이는 <b>개인 Google Workspace(Gmail) 계정이 아직 생성되지 않은 경우</b>에
          주로 발생합니다. 아래 안내를 참고해 Gmail 계정을 생성하신 후
          회원가입을 진행해 주시기 바랍니다.
        </p>
      </header>

      <div className="mb-8 h-px w-full bg-[#e9e9e7]" />

      {/* 본문 */}
      <article className="space-y-10">
        <Section id="section-1" title="1. 원인 안내">
          <P>
            명지대학교는 현재 <b>Google Workspace(Gmail)</b>를 공식 학교 이메일
            서비스로 운영하고 있습니다.
          </P>
          <P>
            인증 메일이 도착하지 않는 경우, <b>개인 Gmail 계정이 아직 생성되지
            않았거나 활성화되지 않은 상태</b>일 가능성이 높습니다. 아래 안내에
            따라 계정을 생성하신 후 다시 시도해 주세요.
          </P>
        </Section>

        <Section id="section-2" title="2. 해결 방법">
          <UL>
            <LI>
              아래 참고 링크를 통해 <b>학교 Gmail 계정 생성 안내</b>를 확인합니다.
            </LI>
            <LI>
              안내에 따라 <b>Google Workspace(Gmail) 계정을 생성</b>합니다.
            </LI>
            <LI>
              계정 생성 후, 본 서비스 회원가입을 다시 진행해 주세요.
            </LI>
          </UL>
        </Section>

        <Section id="section-3" title="3. 참고 링크">
          <p className="text-[15px] leading-[1.95]">
            아래 공지사항 링크를 통해 Gmail 계정 생성 절차를 확인하실 수
            있습니다:
          </p>
          <div className="mt-4">
            <a
              href="https://www.mju.ac.kr/mjukr/129/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGbWp1a3IlMkY1MjIlMkYxOTA5MDclMkZhcnRjbFZpZXcuZG8lM0ZwYWdlJTNEMSUyNnNyY2hDb2x1bW4lM0QlMjZzcmNoV3JkJTNEJTI2YmJzQ2xTZXElM0QlMjZiYnNPcGVuV3JkU2VxJTNEJTI2cmdzQmduZGVTdHIlM0QlMjZyZ3NFbmRkZVN0ciUzRCUyNmlzVmlld01pbmUlM0RmYWxzZSUyNmlzVmlldyUzRHRydWUlMjZwYXNzd29yZCUzRCUyNg%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-[#788cff] px-4 py-2 text-sm font-medium text-[#788cff] hover:bg-gray-50 transition"
            >
              구글 Gmail 계정 생성 안내 바로가기
            </a>
          </div>
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
        <button
          type="button"
          onClick={() => router.push('/sign-up/step1')}
          className="hover:underline underline-offset-4 text-[#788cff]"
        >
          이전 페이지로 돌아가기
        </button>
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
