import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setIsPosition] = useState({ top: 0, left: 0, width: 0 }); // 드롭다운 옵션 위치

  const triggerRef = useRef<HTMLButtonElement>(null); // 드롭다운 트리거
  const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 옵션 ref

  const closeDropdown = () => setIsOpen(false);
  const toggleDropdown = () => setIsOpen((pre) => !pre);

  // 드롭다운 옵션 위치 계산 훅
  useLayoutEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (triggerRef.current) {
        const ref = triggerRef.current.getBoundingClientRect();
        setIsPosition({
          top: window.scrollY + ref?.bottom,
          left: window.scrollX + ref?.left,
          width: ref.width,
        });
      }
    };

    updatePosition(); // 처음 드롭다운 토글 시, 최초 계산

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen]);

  // 드롭다운 외부 영역 클릭 시 닫기 훅
  useEffect(() => {
    if (!isOpen) return;

    const handleOutSideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      closeDropdown();
    };

    document.addEventListener('pointerdown', handleOutSideClick);

    return () =>
      document.removeEventListener('pointerdown', handleOutSideClick);
  }, [isOpen]);

  return {
    isOpen,
    closeDropdown,
    toggleDropdown,
    triggerRef,
    dropdownRef,
    position,
  };
};
