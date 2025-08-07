'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '../../../../libs/api/instance';
import ReservationItem from '@components/admin/ReservationItem';

function formatDateArrayExactly(dateArray) {
  if (!Array.isArray(dateArray)) return '없음';

  const [y, m, d, h, min, s] = dateArray;

  const pad = (n) => String(n).padStart(2, '0');

  return `${y}. ${pad(m)}. ${pad(d)}. ${pad(h)}:${pad(min)}:${pad(s)}`;
}

export default function UserDetailPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);

  const fetchUserDetail = async () => {
    try {
      const response = await axiosInstance.get(`/admin/users/${userId}`);
      console.log('사용자 응답:', response);
      setUser(response.data.data);
    } catch (error) {
      console.error('사용자 상세 조회 실패:', error);
    }
  };

  useEffect(() => {
    if (userId) fetchUserDetail();
  }, [userId]);

  if (!user) {
    return <p className="p-6">로딩 중...</p>;
  }

  return (
    <div className="p-6 bg-[#EFF0F3] min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 mb-1"
          >
            ← 사용자 관리
          </button>
          <h1 className="text-xl font-semibold">{user.username}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 회원 정보 */}
        <div className="bg-white p-4 rounded shadow-sm relative">
          <h2 className="font-semibold text-sm mb-2">회원 정보</h2>
          <div className="text-sm space-y-1">
            <p>
              이름 <span className="ml-2">{user.username}</span>
            </p>
            <p>
              이메일 <span className="ml-2">{user.email}</span>
            </p>
            <p>
              역할 <span className="ml-2">{user.role}</span>
            </p>
          </div>
        </div>

        {/* 가입 정보 */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold text-sm mb-2">가입 정보</h2>
          <div className="text-sm space-y-1">
            <p>
              가입일{' '}
              <span className="ml-2">
                {formatDateArrayExactly(user.registrationDate)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
