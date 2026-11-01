'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import TodayReservationList from '@components/reservation/TodayReservationList';
import TomorrowReservationList from '@components/reservation/TomorrowReservationList';

import { reservation } from '@api/keys/reservation.key';
import {
  selectReservations,
  toReservedTimeSlotsByRoom,
} from '@utils/reservation';

const ReservationSection = () => {
  const [currentTab, setTab] = useState(0);
  const { data: reservations = [] } = useQuery({
    ...reservation.getAll(),
    select: selectReservations,
  });
  const reservedTimeSlotsByRoom = useMemo(
    () => toReservedTimeSlotsByRoom(reservations),
    [reservations],
  );

  const selectMenuHandler = (index) => {
    setTab(index);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-white w-full h-auto mt-2 rounded-t-2xl">
      <div className="flex w-full">
        {[{ name: '오늘 예약하기' }, { name: '내일 예약하기' }].map(
          (tap, index) => (
            <div
              key={index}
              className={`flex-1 text-center p-4 cursor-pointer transition-all duration-300 ${
                currentTab === index
                  ? 'text-gray-800 font-medium border-b-2 border-brand bg-transparent'
                  : 'text-gray-500 font-normal border-b-2 border-transparent bg-transparent hover:text-gray-700'
              }`}
              onClick={() => selectMenuHandler(index)}
            >
              {tap.name}
            </div>
          ),
        )}
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-content">
          <div className={currentTab === 0 ? 'block' : 'hidden'}>
            <TodayReservationList
              reservedTimeSlotsByRoom={reservedTimeSlotsByRoom}
            />
          </div>
          <div className={currentTab === 1 ? 'block' : 'hidden'}>
            <TomorrowReservationList
              reservedTimeSlotsByRoom={reservedTimeSlotsByRoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSection;
