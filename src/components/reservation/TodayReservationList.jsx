import ReservationComponent from '@components/reservation/ReservationComponent';

import { ROOMS } from '@constants/rooms';

const TodayReservationList = ({ reservedTimeSlotsByRoom }) => (
  <div className="w-full">
    {ROOMS.map((room, index) => (
      <ReservationComponent
        key={room.id}
        index={index + 1}
        roomId={room.id}
        roomName={room.name}
        caption={room.caption}
        notice={room.notice}
        reservedTimeSlotsByRoom={reservedTimeSlotsByRoom}
      />
    ))}
  </div>
);

export default TodayReservationList;
