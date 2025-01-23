import ReservationComponent from '@components/common/ReservationComponent';

const TomorrowReservationList = () => {
  return (
    <div className="h-[400px] w-full overflow-y-auto">
      {Array.from({ length: 5 }, (_, index) => (
        <ReservationComponent key={index} index={index + 1} />
      ))}
    </div>
  );
};

export default TomorrowReservationList;
