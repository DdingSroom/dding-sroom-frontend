'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FooterNav from '../../../components/common/FooterNav';

export default function ResetName() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace('/my/account-info');
  }, [router]);

  return (
    <>
      <FooterNav />
    </>
  );
}
