'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ResetName() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace('/my/account-info');
  }, [router]);

  return null;
}
