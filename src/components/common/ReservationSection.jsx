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
              className={`flex-1 text-center p-2 cursor-pointer transition-all duration-200 ${currentTab === index ? 'bg-white text-[#788cff] font-medium' : 'bg-gray-100 text-[#73726e] hover:bg-gray-200'}`}
              onClick={() => selectMenuHandler(index)}
            >
              {tap.name}
            </div>
          );
        })}
      </div>
      <div></div>
      <div className="w-full flex justify-center items-center ">
        <div className="w-full max-w-[95%] h-[400px]">
          {menuArr[currentTab].content}
        </div>
      </div>
    </div>
  );
};

export default ReservationSection;
