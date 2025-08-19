import React from 'react';
import { useRouter } from 'next/navigation';

export default function UserTableRow({ user }) {
  const router = useRouter();

  const handleDetailClick = () => {
    router.push(`/admin/user-detail/${user.id}`);
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
      <td className="py-3 px-2 text-[#666]">{user.id}</td>
      <td className="py-3 px-2">{user.username}</td>
      <td className="py-3 px-2">{user.email}</td>
      <td className="py-3 px-2 text-center">
        <button
          onClick={handleDetailClick}
          className="bg-[#788DFF] text-white px-3 py-1 text-xs rounded hover:bg-[#6a7dff] transition-colors duration-200 font-medium"
        >
          상세 정보 보기
        </button>
      </td>
    </tr>
  );
}
