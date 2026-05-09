'use client';

import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto w-full max-w-layout min-h-screen bg-surface-page">
      {children}
    </div>
  );
}
