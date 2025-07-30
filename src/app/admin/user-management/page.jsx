'use client';

import React from 'react';
import UserTableRow from '@components/admin/UserTableRow';

export default function UserManagement() {
  const users = [
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
  ];

  return (
    <div className="bg-[#F1F2F4] p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">사용자 관리</h1>
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
            {users.map((user) => (
              <UserTableRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
