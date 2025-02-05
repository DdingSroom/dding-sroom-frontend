const Modal = ({ isOpen, onClose, children, text, color }) => {
  if (!isOpen) return null;

  const colorClass = color === 'red' ? 'text-red-500' : 'text-gray-500';

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-4 relative w-[90%] max-w-2xl h-[40%] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <div className="flex justify-center justify-between p-2 cursor-pointer">
          <button className="text-gray-500 w-[50%]" onClick={onClose}>
            취소
          </button>
          <button className={`text-gray-500 w-[50%] ${colorClass}`}>
            {text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
