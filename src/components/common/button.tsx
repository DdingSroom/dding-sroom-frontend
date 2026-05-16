import type { ReactNode } from 'react';

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}

const Button = ({ onClick, children, disabled, ...props }: ButtonProps) => (
  <button
    {...props}
    type="button"
    className={`flex justify-center text-white w-full py-3 rounded-lg text-body-01 font-medium transition-all duration-200 ${
      disabled
        ? 'bg-gray-200 cursor-not-allowed'
        : 'bg-brand cursor-pointer hover:bg-brand-hover active:bg-brand-active hover:shadow-md'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
