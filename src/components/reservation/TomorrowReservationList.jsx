import TomorrowReservationComponent from '@components/reservation/TomorrowReservationComponent';
import { ROOMS } from '@constants/rooms';

const TomorrowReservationList = () => {
  return (
    <div className="w-full">
      {ROOMS.map((room, index) => (
        <TomorrowReservationComponent
          key={room.id}
          index={index + 1}
          roomId={room.id}
          roomName={room.name}
          caption={room.caption}
          notice={room.notice}
        />
      ))}
    </div>
  );
};

export default TomorrowReservationList;
