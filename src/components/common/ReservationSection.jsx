import { useState } from 'react';
import TodayReservationList from '@components/common/TodayReservationList';
import TomorrowReservationList from '@components/common/TomorrowReservationList';

const ReservationSection = () => {
  const [currentTab, setTab] = useState(0);

  const menuArr = [
    { name: '오늘 예약하기', content: <TodayReservationList /> },
    { name: '내일 예약하기', content: <TomorrowReservationList /> },
  ];

  const selectMenuHandler = (index) => {
    setTab(index);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-white w-full h-auto mt-2 rounded-t-2xl">
      <div className="flex w-full">
        {menuArr.map((tap, index) => {
          return (
            <div
              key={index}
              className={`flex-1 text-center p-4 cursor-pointer transition-all duration-300 ${currentTab === index ? 'text-gray-800 font-medium border-b-2 border-[#788cff] bg-transparent' : 'text-gray-500 font-normal border-b-2 border-transparent bg-transparent hover:text-gray-700'}`}
              onClick={() => selectMenuHandler(index)}
            >
              {tap.name}
            </div>
          );
        })}
      </div>
      <div></div>
      <div className="w-full flex justify-center items-center ">
        <div className="w-full max-w-[95%]">
          {menuArr[currentTab].content}
        </div>
      </div>
    </div>
  );
};

export default ReservationSection;
