'use client';

import { useEffect, useMemo, useState } from 'react';

import BasicModal from '@components/common/basic-modal';
import MyPageDate from '@components/my/MyPageDate';

import { useCancelReservation } from '@api/hooks/use-reservation-mutations';
import { useMyReservations } from '@api/hooks/use-reservation-queries';
import { STUDYROOM_IMAGE_SRC } from '@constants/images';
import useAuthReady from '@hooks/useAuthReady';
import { parseReservationDate } from '@utils/reservation';

import ReservationHistory from './ReservationHistory';

const isCanceled = (reservation) => {
  const status = String(reservation.status ?? '')
    .toUpperCase()
    .trim();

  return (
    Boolean(reservation.canceledAt || reservation.cancelledAt) ||
    status === 'CANCELLED' ||
    status === 'CANCELED'
  );
};

const sortByStartDesc = (a, b) => {
  const aTime =
    parseReservationDate(a.startTime ?? a.reservationStartTime)?.getTime() ?? 0;
  const bTime =
    parseReservationDate(b.startTime ?? b.reservationStartTime)?.getTime() ?? 0;
  return bTime - aTime;
};

const groupByDate = (reservations) => {
  const grouped = {};

  reservations.forEach((reservation) => {
    const start = parseReservationDate(
      reservation.startTime ?? reservation.reservationStartTime,
    );
    if (!start) {
      return;
    }

    const key = start.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    (grouped[key] ??= []).push(reservation);
  });

  return grouped;
};

export default function ReservationList() {
  const { authReady, accessToken } = useAuthReady();
  const { mutate, isPending: isCancelPending } = useCancelReservation();
  const {
    data: reservations = [],
    isPending: isReservationsPending,
    error: reservationsError,
  } = useMyReservations(authReady && Boolean(accessToken));

  const [cancelModalData, setCancelModalData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const groupedReservations = useMemo(() => {
    const visibleReservations = reservations
      .filter((reservation) => !isCanceled(reservation))
      .toSorted(sortByStartDesc);
    return groupByDate(visibleReservations);
  }, [reservations]);

  useEffect(() => {
    if (reservationsError) {
      setErrorMessage('예약 내역을 불러오는 중 오류가 발생했습니다.');
    }
  }, [reservationsError]);

  const confirmCancelReservation = () => {
    if (!cancelModalData || isCancelPending) {
      return;
    }

    mutate(
      { reservationId: cancelModalData.id },
      {
        onSuccess: (response) => {
          setSuccessMessage(response.message || '예약이 취소되었습니다.');
          setCancelModalData(null);
        },
        onError: (error) => {
          console.error('예약 취소 실패:', error);
          setErrorMessage(
            error.response?.data?.message || '예약 취소에 실패했습니다.',
          );
        },
      },
    );
  };

  const formatDate = (input) => {
    const date = parseReservationDate(input);
    return date ? `${date.getMonth() + 1}월 ${date.getDate()}일` : '--월 --일';
  };

  const formatTime = (input) => {
    const date = parseReservationDate(input);
    if (!date) {
      return '--:--';
    }
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  if (!authReady || (Boolean(accessToken) && isReservationsPending)) {
    return <div className="p-6">로딩 중...</div>;
  }

  const entries = Object.entries(groupedReservations);

  return (
    <div className="w-full">
      {entries.length === 0 ? (
        <div className="p-6 text-sm text-content-secondary">
          표시할 예약 내역이 없습니다. (취소된 내역은 제외됩니다)
        </div>
      ) : (
        entries.map(([date, dateReservations]) => (
          <div key={date} className="mb-6">
            <MyPageDate date={date} />
            {dateReservations.map((reservation) => (
              <ReservationHistory
                key={reservation.id}
                reservation={reservation}
                onCancel={setCancelModalData}
              />
            ))}
          </div>
        ))
      )}

      {cancelModalData && (
        <BasicModal
          isOpen={true}
          onClose={() => setCancelModalData(null)}
          className="max-w-modal"
          actions={[
            {
              text: '돌아가기',
              onClick: () => setCancelModalData(null),
              variant: 'ghost',
            },
            {
              text: '예약 취소',
              onClick: confirmCancelReservation,
              disabled: isCancelPending,
            },
          ]}
        >
          <div className="p-6 sm:p-8">
            <div className="text-lg font-semibold text-left mb-6 text-content">
              예약을 취소할까요?
            </div>
            <div className="flex items-center gap-4 bg-surface-card p-4 rounded-xl border border-gray-100">
              <img
                src={STUDYROOM_IMAGE_SRC}
                alt="studyroom"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex flex-col gap-1 text-sm">
                <div className="font-semibold text-content">{`스터디룸 ${cancelModalData.roomName}`}</div>
                <div className="text-content-secondary">
                  {formatDate(cancelModalData.startTime)}
                </div>
                <div className="text-content-secondary">
                  {formatTime(cancelModalData.startTime)} ~{' '}
                  {formatTime(cancelModalData.endTime)}
                </div>
              </div>
            </div>
          </div>
        </BasicModal>
      )}

      <BasicModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        className="max-w-modal-sm"
        title="예약 취소"
        message={successMessage}
        actions={[{ text: '확인', onClick: () => setSuccessMessage('') }]}
      />
      <BasicModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage('')}
        className="max-w-modal-sm"
        title="오류"
        message={errorMessage}
        actions={[{ text: '확인', onClick: () => setErrorMessage('') }]}
      />
    </div>
  );
}
