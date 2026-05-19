'use client';

import {
  type ChangeEvent,
  type CompositionEvent,
  TextareaHTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { useDraft } from '@hooks/useDraft';

export interface TextareaHandle {
  clearDraft: () => void;
}

type Size = 'sm' | 'md';
type Resize = 'none' | 'y' | 'both';

interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size' | 'value'
> {
  value?: string;
  draftKey?: string;
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

const Textarea = forwardRef<TextareaHandle, TextareaProps>(function Textarea(
  {
    value: externalValue = '',
    onChange: externalOnChange,
    draftKey,
    placeholder,
    rows = 4,
    maxLength,
    disabled = false,
    resize = 'none',
    size = 'md',
    error = false,
    className = '',
    ...rest
  },
  ref,
) {
  const [isComposing, setIsComposing] = useState(false);
  const draft = useDraft(draftKey, externalValue);

  useImperativeHandle(ref, () => ({
    clearDraft: () => draft.clear(),
  }));

  const value = draftKey != null ? draft.value : externalValue;

  const atLimit =
    !isComposing && maxLength != null && value.length >= maxLength;
  const hasError = error || atLimit;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (
      !isComposing &&
      maxLength != null &&
      e.target.value.length > maxLength
    ) {
      return;
    }
    if (draftKey != null) draft.set(e.target.value);
    externalOnChange?.(e);
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLTextAreaElement>) => {
    setIsComposing(false);
    if (maxLength == null) return;
    const target = e.target as HTMLTextAreaElement;
    if (target.value.length > maxLength) {
      target.value = target.value.slice(0, maxLength);
      if (draftKey != null) draft.set(target.value);
      externalOnChange?.({
        ...e,
        target,
        currentTarget: target,
      } as unknown as ChangeEvent<HTMLTextAreaElement>);
    }
  };

  return (
    <div className="w-full">
      <textarea
        {...rest}
        value={value}
        onChange={handleChange}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={handleCompositionEnd}
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
});

export default Textarea;
