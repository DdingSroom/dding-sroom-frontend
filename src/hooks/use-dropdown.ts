import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 }); // 드롭다운 옵션 위치

  const triggerRef = useRef<HTMLButtonElement>(null); // 드롭다운 트리거
  const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 옵션 ref

  const closeDropdown = () => setIsOpen(false);
  const toggleDropdown = () => setIsOpen((pre) => !pre);

  // 드롭다운 옵션 위치 계산 훅
  useLayoutEffect(() => {
    if (!isOpen) return;

    // 드롭다운 옵션 위치 계산
    const updatePosition = () => {
      if (triggerRef.current) {
        const ref = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: ref?.bottom,
          left: ref?.left,
          width: ref.width,
        });
      }
    };

    let rafId = 0;

    const handleThrottle = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };

    updatePosition(); // 처음 드롭다운 토글 시, 최초 계산

    window.addEventListener('resize', handleThrottle);
    window.addEventListener('scroll', handleThrottle, true);

    return () => {
      window.removeEventListener('resize', handleThrottle);
      window.removeEventListener('scroll', handleThrottle, true);
      cancelAnimationFrame(rafId);
    };
  }, [isOpen]);

  // 드롭다운 외부 영역 클릭 시 닫기 훅
  useEffect(() => {
    if (!isOpen) return;

    const handleOutSideClick = (e: PointerEvent) => {
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
