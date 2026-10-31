'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import ReservationItem from '@components/admin/ReservationItem';
import BasicModal from '@components/common/basic-modal';

import { updateUserRole } from '@api/admin.api';
import { admin } from '@api/keys/admin.key';
import { ADMIN_ROLE } from '@constants/auth';
import useAppNavigation from '@hooks/use-app-navigation';
import useAuthReady from '@hooks/useAuthReady';
import { parseDateTimeParts, toDateTimeSortValue } from '@utils/date-time';

const pad = (n) => String(n).padStart(2, '0');

function formatDateTimeExactly(value) {
  const parts = parseDateTimeParts(value);
  if (!parts) {
    return '없음';
  }
  const [y, m, d, h, min, s] = parts;
  return `${y}. ${pad(m)}. ${pad(d)}. ${pad(h)}:${pad(min)}:${pad(s)}`;
}

function formatDateTimeRange(start, end) {
  const startParts = parseDateTimeParts(start);
  const endParts = parseDateTimeParts(end);
  if (!startParts || !endParts) {
    return '';
  }
  const [y, m, d, h, min] = startParts;
  const [, , , h2, min2] = endParts;
  return `${y}.${pad(m)}.${pad(d)} ${pad(h)}:${pad(min)} ~ ${pad(h2)}:${pad(min2)}`;
}

export default function UserDetailPage() {
  const { userId } = useParams();
  const { goBack } = useAppNavigation();

  const { authReady, accessToken, userId: myUserId, role } = useAuthReady();
  const adminEnabled = authReady && !!accessToken && role === ADMIN_ROLE;
  const queryClient = useQueryClient();

  const numericUserId = Number(userId);
  const hasValidUserId = userId != null && !Number.isNaN(numericUserId);
  const queryEnabled = adminEnabled && hasValidUserId;

  const { data: user = null, isError: isUserError } = useQuery({
    ...admin.admin.users.getById(numericUserId),
    enabled: queryEnabled,
    select: (res) => {
      const data = res?.data;
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('사용자 상세 응답 형식이 올바르지 않습니다.');
      }
      return data;
    },
  });

  const { data: reservations = [], isLoading } = useQuery({
    ...admin.admin.reservations.getByUserId(numericUserId),
    enabled: queryEnabled,
    select: (res) => {
      const list = res?.reservations;
      if (!Array.isArray(list)) {
        throw new Error('사용자 예약 응답 형식이 올바르지 않습니다.');
      }
      return list;
    },
  });

  const loadingReservations = !queryEnabled || isLoading;

  const [showRoleConfirm, setShowRoleConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const nextRole = user?.role === ADMIN_ROLE ? 'ROLE_USER' : ADMIN_ROLE;
  const nextRoleLabel = nextRole === ADMIN_ROLE ? '관리자' : '일반 사용자';
  const isSelf = String(myUserId) === String(userId);

  const { mutate: changeRole, isPending: isRolePending } = useMutation({
    mutationFn: () => updateUserRole(numericUserId, nextRole),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: admin.admin.users.getAll().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: admin.admin.users.getById(numericUserId).queryKey,
      });
      setAlertMessage(`권한이 ${nextRoleLabel}로 변경되었습니다.`);
    },
    onError: (error) => {
      console.error('사용자 권한 변경 실패:', error);
      setAlertMessage(
        error?.response?.data?.message || '권한 변경에 실패했습니다.',
      );
    },
  });

  const confirmRoleChange = () => {
    setShowRoleConfirm(false);
    if (!isRolePending) {
      changeRole();
    }
  };

  /* Loading */
  if (isUserError) {
    return <p className="p-6">사용자 정보를 불러오지 못했습니다.</p>;
  }
  if (!user) {
    return <p className="p-6">로딩 중...</p>;
  }

  return (
    <div className="p-6 bg-surface-admin min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button onClick={goBack} className="text-sm text-gray-600 mb-1">
            ← 사용자 관리
          </button>
          <h1 className="text-xl font-semibold">{user.username}</h1>
        </div>
      </div>

      {/* Cards */}
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
              상태{' '}
              <span className="ml-2">
                {user.state === 'blocked' ? '차단됨' : '정상'}
              </span>
            </p>
            <p>
              역할 <span className="ml-2">{user.role}</span>
            </p>
          </div>
          <div className="mt-3">
            <button
              onClick={() => setShowRoleConfirm(true)}
              disabled={isRolePending || isSelf}
              title={isSelf ? '본인의 권한은 변경할 수 없습니다' : undefined}
              className={`px-3 py-1 text-xs rounded border-2 border-brand text-brand bg-white transition-colors duration-200 font-medium ${
                isRolePending || isSelf
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:bg-gray-50'
              }`}
            >
              {isRolePending ? '처리 중...' : `${nextRoleLabel}로 변경`}
            </button>
          </div>
        </div>

        {/* 가입 정보 */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold text-sm mb-2">가입 정보</h2>
          <div className="text-sm space-y-1">
            <p>
              가입일{' '}
              <span className="ml-2">
                {formatDateTimeExactly(user.registrationDate)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 예약 내역 */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h2 className="font-semibold text-sm mb-3">예약 내역</h2>
        {loadingReservations ? (
          <p>예약 정보를 불러오는 중...</p>
        ) : reservations.length === 0 ? (
          <p className="text-sm text-gray-500">예약 내역이 없습니다.</p>
        ) : (
          reservations
            .sort(
              (a, b) =>
                toDateTimeSortValue(b.createdAt) -
                toDateTimeSortValue(a.createdAt),
            )
            .map((item) => (
              <ReservationItem
                key={item.id}
                room={`스터디룸 ${item.roomName}`}
                time={formatDateTimeRange(item.startTime, item.endTime)}
              />
            ))
        )}
      </div>

      <BasicModal
        isOpen={showRoleConfirm}
        onClose={() => setShowRoleConfirm(false)}
        className="max-w-modal"
        title="사용자 권한 변경"
        message={`${user.username}님의 권한을 ${nextRoleLabel}로 변경하시겠습니까? 변경된 권한은 해당 사용자가 다시 로그인한 뒤 반영됩니다.`}
        actions={[
          {
            text: '취소',
            onClick: () => setShowRoleConfirm(false),
            variant: 'ghost',
          },
          { text: '변경', onClick: confirmRoleChange },
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
    </div>
  );
}
