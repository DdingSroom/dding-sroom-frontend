import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import BasicModal from '@components/common/basic-modal';

import { admin } from '@api/keys/admin.key';
import { updateUserStatus } from '@api/use-admin';

export default function UserTableRow({ user }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const currentStatus = user.status || 'normal';
  const newStatus = currentStatus === 'normal' ? 'blocked' : 'normal';
  const statusText = newStatus === 'blocked' ? '차단' : '정상';

  const { mutate: changeStatus, isPending: isUpdating } = useMutation({
    mutationFn: () => updateUserStatus(user.id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: admin.admin.users.getAll().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: admin.admin.users.getById(user.id).queryKey,
      });
      setAlertMessage(
        `${user.username}님이 ${statusText} 상태로 변경되었습니다.`,
      );
    },
    onError: (error) => {
      console.error('사용자 상태 변경 실패:', error);
      setAlertMessage(
        error?.response?.data?.message || '상태 변경에 실패했습니다.',
      );
    },
  });

  const handleDetailClick = () => {
    router.push(`/admin/user-detail/${user.id}`);
  };

  const handleStatusToggle = () => {
    setShowStatusConfirm(true);
  };

  const confirmStatusToggle = () => {
    setShowStatusConfirm(false);
    changeStatus();
  };

  const statusBadge =
    currentStatus === 'blocked'
      ? { className: 'bg-red-100 text-red-700', label: '차단됨' }
      : { className: 'bg-green-100 text-green-700', label: '정상' };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
      <td className="py-3 px-2 text-gray-500">{user.id}</td>
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
            className="bg-brand text-white px-3 py-1 text-xs rounded hover:bg-brand-hover transition-colors duration-200 font-medium"
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

      <BasicModal
        isOpen={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        className="max-w-modal"
        title="사용자 상태 변경"
        message={`${user.username}님을 ${statusText} 상태로 변경하시겠습니까?`}
        actions={[
          {
            text: '취소',
            onClick: () => setShowStatusConfirm(false),
            variant: 'ghost',
          },
          { text: '변경', onClick: confirmStatusToggle },
        ]}
      />

      <BasicModal
        isOpen={!!alertMessage}
        onClose={() => setAlertMessage('')}
        className="max-w-modal-sm"
        title="알림"
        message={alertMessage}
        actions={[{ text: '확인', onClick: () => setAlertMessage('') }]}
      />
    </tr>
  );
}
