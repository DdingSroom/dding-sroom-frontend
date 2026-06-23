import {
  createContext,
  Dispatch,
  InputHTMLAttributes,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

interface InputContextProps {
  value: string | number;
  onChange: (text: string | number) => void;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>,
    InputContextProps {
  children: ReactNode;
  placeholder?: string;
  type?: string;
}

const InputContext = createContext<InputContextProps | undefined>(undefined);

const useInputContext = () => {
  const context = useContext(InputContext);
  if (!context) throw new Error('input context 내부에서만 사용가능합니다');
  return context;
};

const Input = ({
  value,
  onChange,
  children,
  placeholder,
  type = 'text',
  ...props
}: InputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <InputContext.Provider value={{ value, onChange, visible, setVisible }}>
      <div className="flex items-center w-full px-4 rounded-xl bg-white border border-gray-200 focus-within:border-primary-400">
        <input
          className="flex-1 min-w-0 py-3 outline-none placeholder:text-gray-200 text-caption-01"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type === 'password' ? (visible ? 'text' : 'password') : type}
          {...props}
        />
        <div className="flex items-center gap-1 shrink-0 ml-2">{children}</div>
      </div>
    </InputContext.Provider>
  );
};

// 입력값 초기화(리셋)
const ClearButton = () => {
  const { value, onChange } = useInputContext();
  return (
    value && (
      <button type="button" onClick={() => onChange('')}>
        <ClearRoundedIcon className="text-gray-200" fontSize="small" />
      </button>
    )
  );
};

// 입력값 보이기 (on/off)
const VisibleButton = () => {
  const { visible, setVisible } = useInputContext();

  return (
    <button type="button" onClick={() => setVisible((pre) => !pre)}>
      {visible ? (
        <VisibilityOffOutlinedIcon className="text-gray-200" />
      ) : (
        <VisibilityOutlinedIcon className="text-gray-200" />
      )}
    </button>
  );
};

// 입력값 유효성 검사
const Check = ({ validation }: { validation: () => boolean }) => {
  return (
    <CheckRoundedIcon
      className={`${validation() ? 'text-primary-400' : 'text-gray-200'}`}
      fontSize="small"
    />
  );
};

Input.ClearButton = ClearButton;
Input.VisibleButton = VisibleButton;
Input.Check = Check;

export { Input };
