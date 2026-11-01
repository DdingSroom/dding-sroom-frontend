'use client';

import { useMemo, useState } from 'react';
import { Maru } from 'public/static/icons';

import BasicModal from '@components/common/basic-modal';

import { useCancelReservation } from '@api/hooks/use-reservation-mutations';
import { useMyReservations } from '@api/hooks/use-reservation-queries';
import { STUDYROOM_IMAGE_SRC } from '@constants/images';
import useTokenStore from '@stores/useTokenStore';
import { parseReservationDate } from '@utils/reservation';

const AfterLoginBanner = () => {
  const [openReservationId, setOpenReservationId] = useState(null);
  const { accessToken } = useTokenStore();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { mutate, isPending } = useCancelReservation();
  const { data: reservations = [] } = useMyReservations(Boolean(accessToken));

  const userReservations = useMemo(() => {
    const now = new Date();
    return reservations
      .filter((reservation) => {
        const endTime = parseReservationDate(reservation.endTime);
        return (
          reservation.status === 'RESERVED' && endTime !== null && endTime > now
        );
      })
      .toSorted(
        (a, b) =>
          (parseReservationDate(a.startTime)?.getTime() ?? 0) -
          (parseReservationDate(b.startTime)?.getTime() ?? 0),
      );
  }, [reservations]);

  const formatDate = (input) => {
    const d = parseReservationDate(input);
    return d ? `${d.getMonth() + 1}월 ${d.getDate()}일` : '--월 --일';
  };

  const formatTime = (input) => {
    const d = parseReservationDate(input);
    if (!d) {
      return '--:--';
    }
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleCancelReservation = (reservationId) => {
    if (isPending) {
      return;
    }

    mutate(
      { reservationId },
      {
        onSuccess: (res) => {
          setSuccessMessage(res.message || '예약이 취소되었습니다.');
          setOpenReservationId(null);
        },
        onError: (err) => {
          console.error('예약 취소 실패:', err);
          setOpenReservationId(null);
          setErrorMessage(
            err.response?.data?.message || '예약 취소에 실패했습니다.',
          );
        },
      },
    );
  };

  return (
    <div className="flex flex-row gap-2 sm:gap-3 w-full max-w-content">
      {/* 혼잡도 박스 */}
      <div className="relative flex bg-white rounded-2xl min-h-banner-card w-1/2 p-3 sm:p-6 flex-col justify-between shadow-sm border border-gray-50">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="text-content-secondary text-xs sm:text-sm font-bold">
            오늘의 혼잡도
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl text-brand font-black whitespace-nowrap overflow-hidden">
            여유로움
          </div>
        </div>
        <Maru
          alt="maru"
          className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-16 h-16 sm:w-24 sm:h-24 object-contain opacity-90"
        />
      </div>

      {/* 예약 내역 박스 */}
      <div className="flex flex-col bg-white rounded-2xl min-h-banner-card w-1/2 p-3 sm:p-6 shadow-sm border border-gray-50">
        <div className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-content whitespace-nowrap overflow-hidden">
          내가 예약한 방
        </div>

        {/* 예약 리스트 영역 */}
        <div className="flex flex-col gap-2 sm:gap-3 overflow-y-auto pr-1 sm:pr-2 flex-1 max-h-48">
          {!Array.isArray(userReservations) || userReservations.length === 0 ? (
            <div className="flex items-center justify-center h-full text-content-muted text-xs sm:text-sm">
              예약 내역이 없습니다.
            </div>
          ) : (
            userReservations.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0 mr-2 sm:mr-3 overflow-x-auto sm:overflow-x-visible xScrollHide">
                  <div className="text-xs text-content-secondary whitespace-nowrap sm:overflow-hidden sm:text-ellipsis">
                    {`스터디룸 ${r.roomName}`}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-content whitespace-nowrap sm:overflow-hidden sm:text-ellipsis">
                    {formatDate(r.startTime)} {formatTime(r.startTime)} ~{' '}
                    {formatTime(r.endTime)}
                  </div>
                </div>

                <button
                  className="flex-shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-brand hover:bg-brand hover:text-white rounded-md transition-colors whitespace-nowrap"
                  onClick={() => setOpenReservationId(r.id)}
                >
                  취소
                </button>

                <BasicModal
                  isOpen={openReservationId === r.id}
                  onClose={() => setOpenReservationId(null)}
                  className="max-w-modal"
                  actions={[
                    {
                      text: '돌아가기',
                      onClick: () => setOpenReservationId(null),
                      variant: 'ghost',
                    },
                    {
                      text: '예약 취소',
                      onClick: () => handleCancelReservation(r.id),
                      disabled: isPending,
                    },
                  ]}
                >
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
                      <div className="font-semibold text-content">{`스터디룸 ${r.roomName}`}</div>
                      <div className="text-content-secondary">
                        {formatDate(r.startTime)}
                      </div>
                      <div className="text-content-secondary">
                        {formatTime(r.startTime)} ~ {formatTime(r.endTime)}
                      </div>
                    </div>
                  </div>
                </BasicModal>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .xScrollHide::-webkit-scrollbar {
          display: none;
        }
        .xScrollHide {
          -ms-overflow-style: none; /* IE/Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>

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
};

export default AfterLoginBanner;
