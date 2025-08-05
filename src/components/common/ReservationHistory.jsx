const ReservationHistory = ({ reservation }) => {
  const startRaw = reservation.startTime || reservation.reservationStartTime;
  const endRaw = reservation.endTime || reservation.reservationEndTime;

  const toDate = (raw) => {
    if (Array.isArray(raw)) {
      const [year, month, day, hour = 0, minute = 0] = raw;
      return new Date(year, month - 1, day, hour, minute);
    }
    return raw ? new Date(raw) : null;
  };

  const start = toDate(startRaw);
  const end = toDate(endRaw);

  const formatTime = (date) =>
    date
      ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      : '--:--';

  return (
    <div className="flex items-center p-6 bg-[#FFFF] mt-2 gap-[10px]">
      <img
        src="/static/icons/studyroom_image.png"
        alt="studyroom"
        className="w-[80px] h-[80px] object-cover rounded-md"
      />
      <div className="flex flex-col justify-center">
        <div className="text-2xl">{`스터디룸 ${reservation.roomName}`}</div>
        <div className="text-[#788DFF]">
          {`${formatTime(start)} ~ ${formatTime(end)}`}
        </div>
      </div>
    </div>
  );
};

export default ReservationHistory;
