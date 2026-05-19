'use client';

import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const DEBOUNCE_MS = 500;

export function useDraft(key: string | undefined, initialValue = '') {
  const [value, setValue] = useState(() => {
    if (!key || typeof window === 'undefined') return initialValue;
    return localStorage.getItem(key) ?? initialValue;
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    (newValue: string) => {
      if (!key) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        localStorage.setItem(key, newValue);
      }, DEBOUNCE_MS);
    },
    [key],
  );

  const set = useCallback(
    (newValue: string) => {
      setValue(newValue);
      save(newValue);
    },
    [save],
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      set(e.target.value);
    },
    [set],
  );

  const clear = useCallback(() => {
    if (!key) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    localStorage.removeItem(key);
    setValue('');
  }, [key]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { value, set, onChange, clear };
}
