const TimeComponent = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'reserved':
        return '#9999A3';
      case 'past':
        return '#000000';
      case 'display-only':
        return '#CCCCCC';
      case 'available':
      default:
        return '#788DFF';
    }
  };

  return (
    <div
      className="w-[8px] h-[14px] transition-colors duration-200"
      style={{ backgroundColor: getColor() }}
    />
  );
};

export default TimeComponent;
