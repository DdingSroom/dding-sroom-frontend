'use client';

import { TextareaHTMLAttributes } from 'react';

type Size = 'sm' | 'md';
type Resize = 'none' | 'y' | 'both';

interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size' | 'value'
> {
  value: string;
  resize?: Resize;
  size?: Size;
  error?: boolean;
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-md',
};

const resizeStyles: Record<Resize, string> = {
  none: 'resize-none',
  y: 'resize-y',
  both: 'resize',
};

export default function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  disabled = false,
  resize = 'none',
  size = 'md',
  error = false,
  className = '',
  ...rest
}: TextareaProps) {
  const atLimit = maxLength != null && value.length >= maxLength;
  const hasError = error || atLimit;

  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={[
          'w-full rounded-lg border bg-surface-subtle text-content leading-relaxed',
          'focus:outline-none focus:ring-2 focus:ring-brand/15 transition-colors',
          sizeStyles[size],
          resizeStyles[resize],
          hasError
            ? 'border-error focus:border-error'
            : 'border-line focus:border-brand',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {maxLength != null && (
        <div
          className={`mt-1 text-right text-sm ${atLimit ? 'text-error' : 'text-content-muted'}`}
        >
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}
