'use-client';

import { createPortal } from 'react-dom';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useDropdown } from '@hooks/use-dropdown';

interface DropdownOption {
  value: string | number; // 실제 옵션 데이터
  label?: string; // 화면에 보여질 텍스트
}

interface DropdownProps {
  options: DropdownOption[]; // 드롭다운 데이터
  value?: string | number; // 선택 옵션 데이터
  onChange?: (value: string | number) => void; // 선택 데이터 변경함수
  placeholder?: string; // 드롭다운 설명 기본 텍스트
  disabled?: boolean; // 드롭다운 활성화 여부
  variant?: 'default' | 'modal'; // 드롭다운 z-index (기본 드롭다운 default, 모달 내부 드롭다운 modal)
}

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = '선택',
  disabled = false,
  variant = 'default',
}: DropdownProps) => {
  const {
    isOpen,
    closeDropdown,
    toggleDropdown,
    triggerRef,
    dropdownRef,
    position,
  } = useDropdown();

  // 드롭다운 옵션 선택 함수
  const handleSelected = (option: string | number) => {
    onChange?.(option);
    closeDropdown();
  };

  return (
    <div className="relative w-full max-w-[532px]">
      {/** 드롭다운 셀렉트 박스 */}
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        className={`flex justify-between items-center w-full px-4 py-3 bg-white border 
          ${isOpen ? 'border-primary-200' : 'border-gray-200'} rounded-lg text-gray-700`}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        <span className={`${disabled ? 'text-gray-200' : 'text-gray-700'}`}>
          {value === null || value === undefined
            ? placeholder
            : (options.find((o) => o.value === value)?.label ?? value)}
        </span>
        <KeyboardArrowDownRoundedIcon
          className={`${isOpen ? '-rotate-180 text-gray-700' : 'text-gray-200 '}`}
          sx={{ transition: 'transform 0.3s ease' }}
        />
      </button>

      {/** 드롭다운 옵션 */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: `${position.top + 8}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              maxHeight: `calc(100vh - ${position.top + 32}px)`,
            }}
            className={`p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden border border-gray-200 rounded-lg bg-white ${variant === 'modal' ? 'z-modal' : 'z-dropdown'}`}
          >
            <ul
              role="listbox"
              aria-label={placeholder}
              className="flex flex-col gap-3"
            >
              {options.map((option) => (
                <li key={option.value} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === option.value}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      value === option.value
                        ? 'bg-primary-100 text-primary-500'
                        : 'hover:bg-primary-100/30 text-gray-700'
                    }`}
                    onClick={() => handleSelected(option.value)}
                  >
                    {option.label ?? option.value}
                  </button>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Dropdown;
