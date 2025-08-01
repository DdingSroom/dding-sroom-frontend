const TimeComponent = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'reserved':
        return '#9999A3';
      case 'past':
        return '#000000';
      case 'available':
      default:
        return '#788DFF';
    }
  };

  return (
    <div
      className="
        w-[4px] h-[10px] mx-[0.5px]
        sm:w-[6px] sm:h-[14px]
        transition-colors duration-200
      "
      style={{ backgroundColor: getColor() }}
    />
  );
};

export default TimeComponent;
