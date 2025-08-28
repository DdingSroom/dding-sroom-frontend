'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../libs/api/instance';
import Header from '@components/common/Header';
import FooterNav from '@components/common/FooterNav';

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/api/notification/list');
      if (response.data.error) {
        alert(response.data.error);
        return;
      }
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('공지사항 조회 실패:', error);
      alert('공지사항을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewNotification = async (notification) => {
    try {
      await axiosInstance.post('/api/notification/view', {
        notificationId: notification.id
      });
      
      setSelectedNotification({
        ...notification,
        viewCount: notification.viewCount + 1
      });
      setShowDetailModal(true);
    } catch (error) {
      console.error('조회수 증가 실패:', error);
      setSelectedNotification(notification);
      setShowDetailModal(true);
    }
  };

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 6) return '';
    const [year, month, day, hour, minute, second] = dateArray;
    return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const truncateContent = (content, maxLength = 50) => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <>
      <div className="w-full">
        <Header />
      </div>

      <div className="flex flex-col min-h-screen bg-[#f9fafb] px-4 pb-20">
        <div className="max-w-2xl mx-auto w-full">
          <div className="py-6">
            <h1 className="text-xl font-bold text-gray-800 mb-6">공지사항</h1>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                  로딩 중...
                </div>
              ) : notifications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                  작성된 공지사항이 없습니다.
                </div>
              ) : (
                notifications.map((notification) => (
                  <UserNotificationCard
                    key={notification.id}
                    notification={notification}
                    onViewClick={handleViewNotification}
                    formatDate={formatDate}
                    truncateContent={truncateContent}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <FooterNav />

      {showDetailModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-gray-900 pr-4">
                  {selectedNotification.title}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center text-xs text-gray-500 gap-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    작성자: 관리자
                  </span>
                  <span>작성일: {formatDate(selectedNotification.createdAt)}</span>
                  <span>조회수: {selectedNotification.viewCount}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[300px]">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                    {selectedNotification.content}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UserNotificationCard({ notification, onViewClick, formatDate, truncateContent }) {
  return (
    <article 
      className="relative rounded-xl border bg-white shadow-sm overflow-hidden transition hover:shadow-md cursor-pointer"
      onClick={() => onViewClick(notification)}
    >
      <div
        className="h-1"
        style={{ backgroundColor: 'var(--primary-color)' }}
      />

      <div className="p-4">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="inline-flex items-center px-2 py-0.5 text-[11px] rounded bg-blue-50 text-blue-700 font-medium">
            공지사항
          </span>
        </div>

        <h3 className="font-medium text-base text-gray-900 break-all mb-2">
          {notification.title}
        </h3>
        <p className="text-sm text-gray-600 break-words line-clamp-2 mb-3">
          {truncateContent(notification.content)}
        </p>

        <div className="flex items-center text-xs text-gray-400 gap-3">
          <span>작성일: {formatDate(notification.createdAt)}</span>
          <span>조회수: {notification.viewCount}</span>
        </div>
      </div>
    </article>
  );
}