const ReservationHistory = () => {
  return (
    <div className="flex items-center p-6 bg-[#FFFF] mt-2 gap-[10px]">
      <img
        src="/static/icons/studyroom_image.png"
        alt="studyroom"
        className="w-auto h-auto"
      />
      <div className="flex flex-col justify-center ">
        <div className="text-2xl">스터디룸2</div>
        <div className="text-[#788DFF]">13:00 ~ 15:00</div>
      </div>
    </div>
  );
};

export default ReservationHistory;
