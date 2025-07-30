'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function UserManagement() {
  const router = useRouter();

  const handleDetailClick = () => {
    router.push('/admin/user-detail');
  };

  return (
    <div className="bg-[#F1F2F4] p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">사용자 관리</h1>
          <button className="bg-[#788DFF] text-white px-4 py-2 text-sm rounded">
            단체 메시지 보내기
          </button>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-[#F7F7F7] border-b text-[#333]">
            <tr>
              <th className="py-3 px-2 w-8"> </th>
              <th className="py-3 px-2">이름</th>
              <th className="py-3 px-2">가입 이메일</th>
              <th className="py-3 px-2">학번</th>
              <th className="py-3 px-2 text-center">관리</th>
              <th className="py-3 px-2 text-center w-8"> </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {[
              {
                id: 1,
                name: 'USER 01',
                email: 'mju1111@mju.ac.kr',
                studentId: '60241234',
              },
              {
                id: 2,
                name: 'USER 02',
                email: 'mju2222@mju.ac.kr',
                studentId: '60242345',
              },
            ].map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="py-3 px-2 text-[#666]">{user.id}</td>
                <td className="py-3 px-2">{user.name}</td>
                <td className="py-3 px-2">{user.email}</td>
                <td className="py-3 px-2">{user.studentId}</td>
                <td className="py-3 px-2 text-center">
                  <button className="bg-[#788DFF] text-white px-3 py-1 text-xs rounded">
                    개인메시지 보내기
                  </button>
                </td>
                <td className="py-3 px-2 text-center">
                  <button
                    onClick={handleDetailClick}
                    className="text-[#999] text-lg font-bold"
                  >
                    &gt;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
