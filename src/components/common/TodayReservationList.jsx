import ReservationComponent from '@components/common/ReservationComponent';

const TodayReservationList = () => {
  const rooms = [1, 2, 3, 4, 5];

  return (
    <div className="w-full">
      {rooms.map((roomId, index) => (
        <ReservationComponent key={roomId} index={index + 1} roomId={roomId} />
      ))}
    </div>
  );
};

export default TodayReservationList;
