'use client';

import {
  type ChangeEvent,
  type ComponentProps,
  forwardRef,
  useImperativeHandle,
} from 'react';

import { useDraft } from '@hooks/use-draft';

import Textarea from './textarea';

export interface DraftTextareaHandle {
  clearDraft: () => void;
}

interface DraftTextareaProps extends Omit<
  ComponentProps<typeof Textarea>,
  'value' | 'onChange'
> {
  draftKey: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const DraftTextarea = forwardRef<DraftTextareaHandle, DraftTextareaProps>(
  function DraftTextarea(
    {
      draftKey,
      value: externalValue = '',
      onChange: externalOnChange,
      ...rest
    },
    ref,
  ) {
    const draft = useDraft(draftKey, externalValue);

    useImperativeHandle(ref, () => ({
      clearDraft: () => draft.clear(),
    }));

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      draft.set(e.target.value);
      externalOnChange?.(e);
    };

    return <Textarea {...rest} value={draft.value} onChange={handleChange} />;
  },
);

export default DraftTextarea;
