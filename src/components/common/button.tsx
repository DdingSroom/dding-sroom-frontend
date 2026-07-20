import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
const Button = ({
  type = 'button',
  children,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    disabled={disabled}
    type={type}
    {...props}
    className={`flex justify-center text-white w-full py-3 rounded-lg text-body-01 font-medium transition-all duration-200 ${
      disabled
        ? 'bg-gray-200 cursor-not-allowed'
        : 'bg-primary-400 cursor-pointer hover:bg-primary-500 active:bg-primary-600 hover:shadow-md'
    }`}
  >
    {children}
  </button>
);

export default Button;
