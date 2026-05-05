'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white px-4">
      <div className="mx-auto flex min-h-screen max-w-[560px] flex-col items-center justify-center py-16">
        <img
          src="/maintenance/horse.svg"
          alt="404 안내 이미지"
          className="mb-8 h-[160px] w-auto select-none"
          draggable={false}
        />

        <h1 className="text-center text-xl font-semibold text-primary">
          페이지를 찾을 수 없어요
        </h1>

        <p className="mt-3 text-center text-sm leading-6 text-gray-600">
          요청하신 주소가 변경되었거나 삭제되었을 수 있습니다.
          <br />
          주소를 다시 확인해 주세요.
        </p>

        <div className="mt-8 flex w-full max-w-[360px] gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            이전으로
          </button>

          <Link
            href="/"
            className="flex-1 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
          >
            홈으로
          </Link>
        </div>
      </div>
    </main>
  );
}
