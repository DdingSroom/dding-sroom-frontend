import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserStatus } from '../../libs/api/admin';

export default function UserTableRow({ user, onUserUpdate }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDetailClick = () => {
    router.push(`/admin/user-detail/${user.id}`);
  };

  const handleStatusToggle = async () => {
    const currentStatus = user.status || 'normal';
    const newStatus = currentStatus === 'normal' ? 'blocked' : 'normal';
    const statusText = newStatus === 'blocked' ? '차단' : '정상';

    if (
      !confirm(`${user.username}님을 ${statusText} 상태로 변경하시겠습니까?`)
    ) {
      return;
    }

    setIsUpdating(true);

    try {
      await updateUserStatus(user.id, newStatus);

      // 부모 컴포넌트에 사용자 상태 업데이트 알림
      if (onUserUpdate) {
        onUserUpdate(user.id, { ...user, status: newStatus });
      }

      alert(`${user.username}님이 ${statusText} 상태로 변경되었습니다.`);
    } catch (error) {
      console.error('사용자 상태 변경 실패:', error);
      const msg = error?.response?.data?.message || '상태 변경에 실패했습니다.';
      alert(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatus = user.status || 'normal';
  const statusBadge =
    currentStatus === 'blocked'
      ? { className: 'bg-red-100 text-red-700', label: '차단됨' }
      : { className: 'bg-green-100 text-green-700', label: '정상' };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
      <td className="py-3 px-2 text-[#666]">{user.id}</td>
      <td className="py-3 px-2">{user.username}</td>
      <td className="py-3 px-2">{user.email}</td>
      <td className="py-3 px-2 text-center">
        <div className="flex gap-2 justify-center items-center">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.className}`}
          >
            {statusBadge.label}
          </span>
          <button
            onClick={handleDetailClick}
            className="bg-[#788DFF] text-white px-3 py-1 text-xs rounded hover:bg-[#6a7dff] transition-colors duration-200 font-medium"
          >
            사용자 상세보기
          </button>
          <button
            onClick={handleStatusToggle}
            disabled={isUpdating}
            className={`px-3 py-1 text-xs rounded border-2 transition-colors duration-200 font-medium ${
              currentStatus === 'blocked'
                ? 'border-green-500 text-green-600 bg-white hover:bg-green-50'
                : 'border-red-500 text-red-600 bg-white hover:bg-red-50'
            } ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isUpdating
              ? '처리 중...'
              : currentStatus === 'blocked'
                ? '차단 해제'
                : '차단'}
          </button>
        </div>
      </td>
    </tr>
  );
}
