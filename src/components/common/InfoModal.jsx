'use client';

const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]"
      style={{ backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[90%] max-w-md mx-4 shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto max-h-[70vh] p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">알림</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              시범 운영 단계에서 지원되지 않는 기능입니다
            </p>
          </div>
        </div>

        <div className="flex border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-4 bg-[#788cff] text-white text-sm font-medium hover:bg-[#6a7dff] transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
