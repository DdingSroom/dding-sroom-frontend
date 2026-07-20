'use client';

import {
  type ChangeEvent,
  type CompositionEvent,
  TextareaHTMLAttributes,
  useState,
} from 'react';

type TextareaSize = 'sm' | 'md';
type Resize = 'none' | 'y' | 'both';

interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value'
> {
  value?: string;
  resize?: Resize;
  textareaSize?: TextareaSize;
}

const sizeStyles: Record<TextareaSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-md',
};

const resizeStyles: Record<Resize, string> = {
  none: 'resize-none',
  y: 'resize-y',
  both: 'resize',
};

export default function Textarea({
  value = '',
  onChange,
  maxLength,
  disabled = false,
  resize = 'none',
  textareaSize = 'md',
  className = '',
  ...rest
}: TextareaProps) {
  const [isComposing, setIsComposing] = useState(false);

  const atLimit =
    !isComposing && maxLength != null && value.length >= maxLength;
  const hasError = atLimit;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (
      !isComposing &&
      maxLength != null &&
      e.target.value.length > maxLength
    ) {
      return;
    }
    onChange?.(e);
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLTextAreaElement>) => {
    setIsComposing(false);
    if (maxLength == null) return;
    const target = e.target as HTMLTextAreaElement;
    if (target.value.length > maxLength) {
      target.value = target.value.slice(0, maxLength);
      onChange?.({
        ...e,
        target,
        currentTarget: target,
      } as unknown as ChangeEvent<HTMLTextAreaElement>);
    }
  };

  return (
    <div className="w-full">
      <textarea
        rows={4}
        {...rest}
        value={value}
        onChange={handleChange}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={handleCompositionEnd}
        maxLength={maxLength}
        disabled={disabled}
        className={[
          'w-full rounded-lg border bg-surface-subtle text-content leading-relaxed',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-colors',
          sizeStyles[textareaSize],
          resizeStyles[resize],
          hasError
            ? 'border-red-500 focus:border-red-500'
            : 'border-line focus:border-primary-500',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
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
