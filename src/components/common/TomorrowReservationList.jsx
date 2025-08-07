import TomorrowReservationComponent from '@components/common/TomorrowReservationComponent';

const TomorrowReservationList = () => {
  const rooms = [1, 2, 3, 4, 5];

  return (
    <div className="h-[400px] w-full overflow-y-auto">
      {rooms.map((roomId, index) => (
        <TomorrowReservationComponent
          key={roomId}
          index={index + 1}
          roomId={roomId}
        />
      ))}
    </div>
  );
};

export default TomorrowReservationList;
