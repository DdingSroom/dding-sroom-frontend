import React from 'react';

const LoginRequiredModal = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl w-[90%] max-w-[400px] mx-4 shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-[#37352f] mb-4">
            로그인이 필요한 기능입니다
          </h3>
          <p className="text-sm text-[#73726e] mb-6">
            이 페이지를 이용하려면 로그인이 필요합니다.
          </p>
        </div>

        <div className="border-t border-gray-100">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-[#788cff] text-white text-sm font-medium hover:bg-[#6a7dff] transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
