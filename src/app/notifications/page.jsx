'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '../../libs/api/instance';
import Header from '@components/common/Header';
import FooterNav from '@components/common/FooterNav';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  // const router = useRouter();

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
        notificationId: notification.id,
      });

      setSelectedNotification({
        ...notification,
        viewCount: notification.viewCount + 1,
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
    const [year, month, day, hour, minute] = dateArray;
    return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const truncateContent = (content, maxLength = 50) => {
    if (!content) return '';
    return content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;
  };

  function BottomSafeSpacer({ height = 64 }) {
    return (
      <div
        aria-hidden="true"
        style={{
          height: `calc(${height}px + env(safe-area-inset-bottom, 0px))`,
        }}
      />
    );
  }

  return (
    <>
      <div className="w-full">
        <Header />
      </div>

      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] px-4 pb-20">
        <div className="max-w-4xl mx-auto w-full">
          <div className="py-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#788cff] rounded-2xl mb-4 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5zM12 3v14"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                공지사항
              </h1>
              <p className="text-gray-600">
                중요한 소식과 업데이트를 확인하세요.
              </p>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-[#788cff] rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-500 font-medium">
                    공지사항을 불러오는 중...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    아직 공지사항이 없습니다
                  </h3>
                  <p className="text-gray-500">
                    새로운 공지사항이 등록되면 이곳에 표시됩니다
                  </p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <UserNotificationCard
                    key={notification.id}
                    notification={notification}
                    onViewClick={handleViewNotification}
                    formatDate={formatDate}
                    truncateContent={truncateContent}
                    index={index}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav />

      {showDetailModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 bg-[#788cff] px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">
                    공지사항 상세
                  </span>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
                  {selectedNotification.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#788cff]/10 rounded-full">
                    <svg
                      className="w-4 h-4 text-[#788cff]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">관리자</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a4 4 0 118 0v4m-4 9v2m0-6h.01M12 21a9 9 0 100-18 9 9 0 000 18z"
                      />
                    </svg>
                    <span>{formatDate(selectedNotification.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>조회수 {selectedNotification.viewCount}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-800 whitespace-pre-wrap break-words leading-relaxed text-base">
                    {selectedNotification.content}
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-8 py-3 bg-[#788cff] text-white rounded-xl hover:bg-[#6a7dff] font-semibold shadow-lg"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UserNotificationCard({
  notification,
  onViewClick,
  formatDate,
  truncateContent,
  index,
}) {
  const isNew = index < 3;

  return (
    <article
      className="group relative rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg overflow-hidden cursor-pointer"
      onClick={() => onViewClick(notification)}
    >
      <div className="absolute inset-0 bg-[#788cff]/5 opacity-0 group-hover:opacity-100" />

      <div className="relative">
        <div className="h-1 bg-[#788cff]" />

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-[#788cff] text-white shadow-sm">
                <svg
                  className="w-3 h-3 mr-1.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                공지사항
              </span>
              {isNew && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-full bg-red-400 text-white">
                  NEW
                </span>
              )}
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">
                {formatDate(notification.createdAt)}
              </div>
              <div className="flex items-center text-xs text-gray-400 gap-2">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>{notification.viewCount}</span>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-lg text-gray-900 break-all mb-3 group-hover:text-[#788cff]">
            {notification.title}
          </h3>

          <p className="text-gray-600 break-words line-clamp-3 leading-relaxed mb-4">
            {truncateContent(notification.content, 120)}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500 gap-4">
              <span className="inline-flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                관리자
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#788cff] group-hover:text-[#6a7dff]">
              자세히 보기
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
