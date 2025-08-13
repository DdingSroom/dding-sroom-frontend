import TomorrowReservationComponent from '@components/common/TomorrowReservationComponent';

const TomorrowReservationList = () => {
  const rooms = [1, 2, 3, 4, 5];

  return (
    <div className="w-full">
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
