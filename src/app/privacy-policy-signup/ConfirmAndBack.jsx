'use client';

import Link from 'next/link';

export default function ConfirmAndBack() {
  const handleClick = () => {
    try {
      // 회원가입 3단계에서 체크박스 활성화용 1회성 플래그
      sessionStorage.setItem('policyReviewed', '1');
    } catch (err) {
      // 세션 스토리지 접근 불가 시 무시
      // console.error('세션 저장 실패:', err);
    }
  };

  return (
    <Link
      href="/login/sign-up-step3"
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-xl 
                 bg-[#788cff] text-white px-6 py-3 text-base font-semibold
                 shadow-md hover:opacity-90 transition min-w-[140px]"
    >
      동의하고 돌아가기
    </Link>
  );
}
