const Button = ({ onClick, disabled, text, ...props }) => {
  const buttonText = typeof text === 'string' ? text : '';

  return (
    <button
      {...props}
      className={`flex items-center justify-center w-full h-[2.5625rem] rounded-[0.44963rem] text-[0.97419rem] ${
        disabled
          ? 'bg-[#d5d5d5] text-[#9999a2]'
          : 'bg-[#788cff] text-white cursor-pointer'
      } `}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
};

export default Button;
