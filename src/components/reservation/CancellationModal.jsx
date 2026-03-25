'use client';

const CancellationModal = ({ isOpen, onClose, onConfirm, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full 
                 bg-black bg-opacity-50 
                 flex justify-center items-center 
                 z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] w-[90%] max-w-[500px] p-6 sm:p-8 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto max-h-[70vh]">{children}</div>

        <div className="flex w-full mt-6 rounded-xl overflow-hidden border border-primary-dark">
          <button
            onClick={onClose}
            className="w-1/2 py-3 bg-white text-gray-600 text-sm font-medium rounded-none hover:bg-gray-50 transition-colors duration-200"
          >
            돌아가기
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onConfirm) onConfirm();
            }}
            className="w-1/2 py-3 bg-primary text-white text-sm font-semibold rounded-none hover:bg-primary-hover transition-colors duration-200"
          >
            예약 취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;
