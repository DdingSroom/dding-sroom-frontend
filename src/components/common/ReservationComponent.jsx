import TimeComponent from '@components/common/TimeComponent';

const ReservationComponent = ({index}) => {
  return (
    <div className="flex flex-col justify-between p-7 bg-white rounded-2xl w-full max-w-[100%]h-auto min-h-[10rem] mt-[1rem]">
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <div className="text-2xl">스터디룸 {index}</div>
          <div className="text-[#9999A3]">5인실</div>
        </div>
        <button className="bg-[#3250F5] text-lg text-white rounded-3xl p-2 w-[15%]">예약</button>
      </div>
      <div className="flex flex-nowrap justify-between ">
        {Array.from({ length: 24 }, (_, index) => (
          <TimeComponent key={index} />
        ))}
      </div>
      <div className="bg-black h-0.5 w-full bg-[#9999A3]"></div>
    </div>
  );
};

export default ReservationComponent;