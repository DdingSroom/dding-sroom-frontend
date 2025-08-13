const ReservationHistory = ({ reservation, onCancel }) => {
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

  const now = new Date();
  const canCancel = end && end.getTime() > now.getTime();

  return (
    <div className="flex items-center p-5 bg-gray-50/50 mt-3 gap-4 rounded-lg border border-gray-100/80 hover:bg-gray-50 transition-colors duration-300">
      <div>
        <img
          src="/static/icons/studyroom_image.png"
          alt="studyroom"
          className="w-16 h-16 object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-center flex-1 gap-1.5">
        <div className="text-base font-medium text-gray-700">{`스터디룸 ${reservation.roomName}`}</div>
        <div className="text-sm text-gray-500">
          {`${formatTime(start)} ~ ${formatTime(end)}`}
        </div>
      </div>
      {canCancel && onCancel && (
        <button
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-md transition-colors duration-200 border border-gray-200"
          onClick={() => onCancel(reservation)}
        >
          취소
        </button>
      )}
    </div>
  );
};

export default ReservationHistory;
