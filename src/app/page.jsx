'use client';

import React, { useEffect, useState } from 'react';
import Header from '@components/common/Header';
import Banner from '@components/common/Banner';
import AfterLoginBanner from '@components/common/AfterLoginBanner';
import SecondBanner from '@components/common/SecondBanner';
import ReservationSection from '@components/common/ReservationSection';
import FooterNav from '@components/common/FooterNav';

import useTokenStore from '../stores/useTokenStore';
import { jwtDecode } from 'jwt-decode';

export default function Home() {
  const { accessToken, setUserId, initializeFromStorage } = useTokenStore();

  const [userInfo, setUserInfo] = useState({ id: '', email: '' });
  const [isMounted, setIsMounted] = useState(false); // hydration mismatch 방지

  useEffect(() => {
    setIsMounted(true); // CSR 이후에만 렌더링하게 함

    // Zustand 상태를 클라이언트에서 초기화
    // initializeFromStorage();
  }, []);

  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const { id, email } = decoded;

        setUserId(id);
        setUserInfo({ id, email });

        console.log('디코드된 사용자 정보:', decoded);
      } catch (e) {
        console.error('토큰 디코딩 실패:', e);
        alert('토큰이 유효하지 않습니다. 다시 로그인해주세요.');
      }
    } else {
      console.warn('로그인하지 않은 상태입니다.');
    }
  }, [accessToken, setUserId]);

  // 서버에서는 아무것도 렌더링하지 않도록 처리
  if (!isMounted) return null;

  return (
    <>
      <div className="w-full">
        <Header />
      </div>

      <div className="flex justify-center w-full">
        {accessToken ? (
          <AfterLoginBanner className="w-full" />
        ) : (
          <Banner className="w-full" />
        )}
      </div>

      <div className="flex justify-center w-full">
        <SecondBanner className="w-full" />
      </div>

      <div className="flex justify-center w-full flex-grow">
        <ReservationSection className="w-full" />
      </div>

      <div className="pb-20">
        <FooterNav />
      </div>
    </>
  );
}
