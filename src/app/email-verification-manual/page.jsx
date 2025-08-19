'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const updatedAt = '2025-08-19 (KST)';

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
          일부 학우분들이 학교 이메일 인증 메일을 받지 못하는 현상이 발생하고
          있습니다. 이는 서비스 문제가 아닌 <b>명지대학교 측 시스템 변경</b>에
          따른 것으로, 아래 매뉴얼을 참고해 이메일 계정을 정상화하신 후
          회원가입을 진행해 주시기 바랍니다.
        </p>
      </header>

      <div className="mb-8 h-px w-full bg-[#e9e9e7]" />

      {/* 본문 */}
      <article className="space-y-10">
        <Section id="section-1" title="1. 문제 원인 안내">
          <P>
            명지대학교 측에서 <b>2023년 11월 자로 MS Outlook 서비스를 해지</b>
            하였기에,<b> 2023년 11월 이전 생성된 학교 계정</b>은 일괄 사용정지
            처리된 상태입니다.
          </P>
          <P>
            따라서 현재 해당 계정으로는 메일을 주고받을 수 없는 상태입니다. 인증
            메일이 도착하지 않는 경우, 이는 우리 서비스의 문제가 아닌
            <b> 학교 메일 시스템 변경으로 인한 이슈</b>임을 알려드립니다.
          </P>
        </Section>

        <Section id="section-2" title="2. 해결 방법">
          <UL>
            <LI>
              명지대학교 측에서 공지한 <b>구글 워크스페이스 메일 이관 매뉴얼</b>
              을 확인합니다.
            </LI>
            <LI>
              안내에 따라 기존 Outlook 계정을 구글 워크스페이스 계정으로
              이관합니다.
            </LI>
            <LI>
              계정이 정상적으로 이관된 후, 본 서비스 회원가입을 다시 진행해
              주세요.
            </LI>
          </UL>
        </Section>

        <Section id="section-3" title="3. 참고 링크">
          <p className="text-[15px] leading-[1.95]">
            아래 공지사항 및 매뉴얼 링크를 통해 구체적인 절차를 확인하실 수
            있습니다:
          </p>
          <div className="mt-4">
            <a
              href="https://www.mju.ac.kr/mjukr/255/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGbWp1a3IlMkYxNDElMkYyMDY2NTglMkZhcnRjbFZpZXcuZG8lM0Y%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-[#788cff] px-4 py-2 text-sm font-medium text-[#788cff] hover:bg-gray-50 transition"
            >
              구글 워크스페이스 메일 이관 매뉴얼 바로가기
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
          onClick={() => router.push('/login/sign-up-step1')}
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
