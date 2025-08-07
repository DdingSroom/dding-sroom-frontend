'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../libs/api/instance';
import UserTableRow from '@components/admin/UserTableRow';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/users');

      // 응답 구조 확인용 로그
      console.log('전체 응답:', response);
      console.log('response.data:', response.data);

      setUsers(response.data.users || []);
    } catch (err) {
      console.error('사용자 불러오기 실패:', err);
      setError('사용자 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-[#F1F2F4] p-6 min-h-screen">
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
            <thead className="bg-[#F7F7F7] border-b text-[#333]">
              <tr>
                <th className="py-3 px-2 w-8">ID</th>
                <th className="py-3 px-2">이름</th>
                <th className="py-3 px-2">가입 이메일</th>
                <th className="py-3 px-2 text-center">관리</th>
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
