const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

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
          <button className="text-gray-500 w-[50%]">예약하기</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
