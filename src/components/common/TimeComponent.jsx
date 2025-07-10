const TimeComponent = ({ status }) => {
  let bgColor = '#788DFF';

  if (status === 'reserved') bgColor = '#9999A3';
  else if (status === 'past') bgColor = '#000000';

  return (
    <div
      className="w-[13px] h-[20px] rounded-sm"
      style={{ backgroundColor: bgColor }}
    ></div>
  );
};

export default TimeComponent;
