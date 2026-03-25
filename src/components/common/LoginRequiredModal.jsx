import React from 'react';

const LoginRequiredModal = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-modal backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl w-modal max-w-modal-sm mx-4 shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-content mb-4">
            로그인이 필요한 기능입니다
          </h3>
          <p className="text-sm text-content-secondary mb-6">
            이 페이지를 이용하려면 로그인이 필요합니다.
          </p>
        </div>

        <div className="border-t border-gray-100">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
