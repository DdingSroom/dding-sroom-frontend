'use client';

import { useEffect, useState } from 'react';

import TodayReservationList from '@components/reservation/TodayReservationList';
import TomorrowReservationList from '@components/reservation/TomorrowReservationList';

import useReservationStore from '@stores/useReservationStore';

const ReservationSection = () => {
  const [currentTab, setTab] = useState(0);

  const { fetchAllReservedTimes, isReservedTimesError } = useReservationStore();

  useEffect(() => {
    fetchAllReservedTimes();
    const intervalId = setInterval(fetchAllReservedTimes, 10000);
    return () => clearInterval(intervalId);
  }, [fetchAllReservedTimes]);

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
          {isReservedTimesError && (
            <p role="alert" className="mt-4 text-center text-sm text-red-500">
              예약 현황을 불러오지 못했습니다. 표시된 시간이 실제와 다를 수
              있습니다.
            </p>
          )}
          <div className={currentTab === 0 ? 'block' : 'hidden'}>
            <TodayReservationList />
          </div>
          <div className={currentTab === 1 ? 'block' : 'hidden'}>
            <TomorrowReservationList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSection;
