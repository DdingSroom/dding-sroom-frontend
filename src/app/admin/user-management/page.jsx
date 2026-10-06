'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';

import UserTableRow from '@components/admin/UserTableRow';

import { admin } from '@api/keys/admin.key';
import { ADMIN_ROLE } from '@constants/auth';
import useAuthReady from '@hooks/useAuthReady';

export default function UserManagement() {
  const { authReady, accessToken, role } = useAuthReady();
  const adminEnabled = authReady && !!accessToken && role === ADMIN_ROLE;

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    ...admin.admin.users.getAll(),
    enabled: adminEnabled,
    select: (res) => {
      const list = res?.users;
      if (!Array.isArray(list)) {
        throw new Error('사용자 목록 응답 형식이 올바르지 않습니다.');
      }
      return list;
    },
  });

  const loading = !adminEnabled || isLoading;
  const error = isError ? '사용자 정보를 불러오는 데 실패했습니다.' : null;

  return (
    <div className="bg-surface-admin p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">사용자 관리</h1>
          {!loading && !error && (
            <p className="text-sm text-gray-500">
              총 <span className="font-semibold">{users.length}</span>명의
              사용자가 등록되어 있습니다.
            </p>
          )}
        </div>

        {loading ? (
          <p className="text-gray-500">로딩 중...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-admin-header border-b text-gray-700">
              <tr>
                <th className="py-3 px-2 w-8">ID</th>
                <th className="py-3 px-2">이름</th>
                <th className="py-3 px-2">가입 이메일</th>
                <th className="py-3 px-2 text-center">상태 & 관리</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {Array.isArray(users) ? (
                users.map((user) => <UserTableRow key={user.id} user={user} />)
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    사용자 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
