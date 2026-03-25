const Button = ({ onClick, disabled, text, ...props }) => {
  const buttonText = typeof text === 'string' ? text : '';

  return (
    <button
      {...props}
      className={`flex items-center justify-center w-full h-12 rounded-lg text-sm font-medium transition-all duration-200 ${
        disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-primary text-white cursor-pointer hover:bg-primary-hover active:bg-primary-active hover:shadow-md'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
};

export default Button;
