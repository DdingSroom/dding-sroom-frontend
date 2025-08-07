const Modal = ({ isOpen, onClose, onSubmit, children, text }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[90%] max-w-md mx-4 shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto max-h-[70vh] p-6">{children}</div>

        <div className="flex border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white text-[#73726e] text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onSubmit) onSubmit();
            }}
            className="flex-1 py-4 bg-[#788cff] text-white text-sm font-medium hover:bg-[#6a7dff] transition-colors"
          >
            {text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
