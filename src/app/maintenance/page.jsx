export default function MaintenancePage() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="flex w-full max-w-[420px] flex-col items-center rounded-3xl bg-white px-6 py-8 shadow-2xl">
        <img
          src="/maintenance/horse.svg"
          alt="점검 안내 이미지"
          className="mb-5 h-[140px] w-auto select-none"
          draggable={false}
        />

        <h1 className="text-center text-lg font-semibold text-[#788DFF]">
          스터디룸 이용 중단 안내
        </h1>

        <p className="mt-3 text-center text-sm leading-6 text-gray-600">
          학생회관 4층 내부 공사로 인해
          <br />
          <span className="font-medium text-[#788DFF]">
            2025.12.23 – 2026.02.28
          </span>
          <br />
          스터디룸 이용이 일시 중단됩니다.
        </p>

        <p className="mt-3 text-center text-sm leading-6 text-gray-600">
          <span className="font-medium text-[#788DFF]">2026년 3월</span>
          부터 띵스룸 서비스 이용이 다시 가능합니다.
        </p>

        <div className="mt-5 rounded-xl bg-[#788DFF]/10 px-4 py-3 text-center text-xs leading-5 text-gray-600">
          공사 일정 변동 시 별도 공지될 예정입니다.
        </div>
      </div>
    </div>
  );
}
