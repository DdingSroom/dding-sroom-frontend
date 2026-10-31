export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/75 backdrop-blur-[2px]"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          aria-hidden="true"
          className="h-11 w-11 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500"
        />
        <span className="text-sm font-medium text-primary-700">
          페이지를 불러오는 중이에요
        </span>
      </div>
      <span className="sr-only">로딩 중</span>
    </div>
  );
}
