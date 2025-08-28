'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InfoModal from './InfoModal';
import axiosInstance from '../../libs/api/instance';

const Header = () => {
  const router = useRouter();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [recentNotificationCount, setRecentNotificationCount] = useState(0);

  useEffect(() => {
    fetchRecentNotificationCount();
  }, []);

  const fetchRecentNotificationCount = async () => {
    try {
      const response = await axiosInstance.get('/api/notification/recent-count');
      if (response.data.error) {
        console.error('최근 공지사항 개수 조회 실패:', response.data.error);
        return;
      }
      setRecentNotificationCount(response.data.data || 0);
    } catch (error) {
      console.error('최근 공지사항 개수 조회 실패:', error);
    }
  };

  const handleClickProfile = () => {
    router.push('/my/account-info');
  };

  const handleClickNotification = () => {
    router.push('/notifications');
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 pt-12 bg-transparent">
      <img src="/static/icons/logo.svg" alt="logo" className="h-12" />
      <div className="flex items-center gap-4">
        {recentNotificationCount > 0 && (
          <div className="relative">
            <span className="text-xs text-red-500 font-medium mr-1">
              new {recentNotificationCount}
            </span>
          </div>
        )}
        <button
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          onClick={handleClickNotification}
        >
          <img
            src="/static/icons/bell_icon.png"
            alt="notification"
            className="h-6 w-6"
          />
        </button>
        <button
          className="w-9 h-9 bg-[#788DFF] rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:bg-[#6a7dff] transition-colors shadow-sm"
          onClick={handleClickProfile}
        >
          <img
            src="/static/icons/person_icon.png"
            alt="person_icon"
            className="w-6 h-6 object-contain"
          />
        </button>
      </div>

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </header>
  );
};

export default Header;
