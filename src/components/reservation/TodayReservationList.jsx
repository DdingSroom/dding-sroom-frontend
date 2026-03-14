import ReservationComponent from '@components/reservation/ReservationComponent';

const TodayReservationList = () => {
  const rooms = [
    { id: 1, name: '스터디룸 1', caption: '5인실' },
    { id: 2, name: '스터디룸 2', caption: '5인실' },
    { id: 3, name: '스터디룸 3', caption: '5인실' },
    { id: 4, name: '스터디룸 4', caption: '5인실' },
    { id: 5, name: '스터디룸 5', caption: '5인실' },
    { id: 6, name: '휴게공간 1' },
    { id: 7, name: '휴게공간 2' },
    { id: 8, name: '휴게공간 3' },
    {
      id: 9,
      name: '휴게공간 4',
      notice: '장애우 전용 공간이므로 장애우 분들만 예약 가능합니다.',
    },
  ];

  return (
    <div className="w-full">
      {rooms.map((room, index) => (
        <ReservationComponent
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

export default TodayReservationList;
