const TimeComponent = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'reserved':
        return 'var(--color-status-reserved)';
      case 'past':
        return 'var(--color-status-past)';
      case 'display-only':
        return 'var(--color-status-display)';
      case 'available':
      default:
        return 'var(--color-primary)';
    }
  };

  return (
    <div
      className="w-time-slot h-time-slot transition-colors duration-200"
      style={{ backgroundColor: getColor() }}
    />
  );
};

export default TimeComponent;
