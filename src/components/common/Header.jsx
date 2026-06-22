'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import InfoModal from '@components/common/InfoModal';

import axiosInstance from '@api/instance';
import { Bell, Person } from 'public/static/icons';

const Header = () => {
  const router = useRouter();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [recentNotificationCount, setRecentNotificationCount] = useState(0);

  useEffect(() => {
    fetchRecentNotificationCount();
  }, []);

  const fetchRecentNotificationCount = async () => {
    try {
      const response = await axiosInstance.get(
        '/api/notification/recent-count',
      );
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

  const handleClickLogo = () => {
    router.push('/');
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 pt-12 bg-transparent">
      <img
        src="/static/icons/logo.svg"
        alt="logo"
        className="h-12 cursor-pointer"
        onClick={handleClickLogo}
      />
      <div className="flex items-center gap-4">
        <button
          aria-label="알림페이지로 이동"
          className="relative p-2 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:scale-105"
          onClick={handleClickNotification}
        >
          <Bell aria-hidden="true" />
          {recentNotificationCount > 0 && (
            <div className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center">
              <span className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-400 rounded-full min-w-[18px] h-4 shadow-lg">
                  {recentNotificationCount > 99
                    ? '99+'
                    : recentNotificationCount}
                </span>
              </span>
            </div>
          )}
        </button>
        <button
          aria-label="마이페이지로 이동"
          className="w-[29px] h-[29px] bg-[#788DFF] relative rounded-full overflow-hidden cursor-pointer hover:bg-[#6a7dff] transition-colors shadow-sm"
          onClick={handleClickProfile}
        >
          <Person
            aria-hidden="true"
            className="text-white absolute bottom-[-1px] left-1/2 -translate-x-1/2"
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
