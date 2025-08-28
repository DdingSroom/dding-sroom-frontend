'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '../../../libs/api/instance';

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

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

  const handleCreateNotification = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/notification/create', {
        title: formData.title,
        content: formData.content,
      });

      if (response.data.error) {
        alert(response.data.error);
        return;
      }

      alert('공지사항이 성공적으로 생성되었습니다!');
      setFormData({ title: '', content: '' });
      setShowCreateForm(false);
      fetchNotifications();
    } catch (error) {
      console.error('공지사항 생성 실패:', error);
      alert('공지사항 생성에 실패했습니다.');
    }
  };

  const handleUpdateNotification = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axiosInstance.put('/api/notification/update', {
        notificationId: selectedNotification.id,
        title: formData.title,
        content: formData.content,
      });

      if (response.data.error) {
        alert(response.data.error);
        return;
      }

      alert('공지사항이 성공적으로 수정되었습니다!');
      setFormData({ title: '', content: '' });
      setShowEditForm(false);
      setSelectedNotification(null);
      fetchNotifications();
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      alert('공지사항 수정에 실패했습니다.');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `/api/notification/delete/${notificationId}`,
      );

      if (response.data.error) {
        alert(response.data.error);
        return;
      }

      alert('공지사항이 성공적으로 삭제되었습니다!');
      fetchNotifications();
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
      alert('공지사항 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 6) return '';
    const [year, month, day, hour, minute] = dateArray;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const formatDateOnly = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) return '';
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const truncateContent = (content, maxLength = 50) => {
    if (!content) return '';
    return content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;
  };

  const groupNotificationsByDate = (notifications) => {
    const grouped = {};
    notifications.forEach((notification) => {
      const dateKey = formatDateOnly(notification.createdAt);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(notification);
    });
    return grouped;
  };

  const getSortedDates = (grouped) => {
    return Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
  };

  const openDetailModal = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

  const openEditForm = (notification) => {
    setSelectedNotification(notification);
    setFormData({
      title: notification.title,
      content: notification.content,
    });
    setShowDetailModal(false);
    setShowEditForm(true);
  };

  if (showCreateForm) {
    return (
      <div className="bg-[#F1F2F4] p-6 min-h-screen">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => {
                setShowCreateForm(false);
                setFormData({ title: '', content: '' });
              }}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← 돌아가기
            </button>
            <h1 className="text-lg font-semibold">공지사항 작성</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] resize-y"
                placeholder="공지사항 내용을 입력하세요"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreateNotification}
                className="px-4 py-2 text-white rounded-md transition-colors"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                작성하기
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ title: '', content: '' });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showEditForm) {
    return (
      <div className="bg-[#F1F2F4] p-6 min-h-screen">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => {
                setShowEditForm(false);
                setSelectedNotification(null);
                setFormData({ title: '', content: '' });
              }}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← 돌아가기
            </button>
            <h1 className="text-lg font-semibold">공지사항 수정</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] resize-y"
                placeholder="공지사항 내용을 입력하세요"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUpdateNotification}
                className="px-4 py-2 text-white rounded-md transition-colors"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                수정하기
              </button>
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setSelectedNotification(null);
                  setFormData({ title: '', content: '' });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const groupedNotifications = groupNotificationsByDate(notifications);
  const sortedDates = getSortedDates(groupedNotifications);

  return (
    <div className="bg-[#F1F2F4] p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-lg font-semibold mb-4">공지사항 관리</h1>

        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 text-white rounded transition-colors"
            style={{
              backgroundColor: 'var(--primary-color)',
              borderColor: 'var(--primary-color)',
            }}
          >
            공지사항 작성
          </button>
        </div>

        {isLoading && <p className="text-sm text-gray-500">로딩 중...</p>}
        {!isLoading && notifications.length === 0 && (
          <p className="text-sm text-gray-500">작성된 공지사항이 없습니다.</p>
        )}

        {!isLoading &&
          notifications.length > 0 &&
          sortedDates.map((date) => (
            <section key={date} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-block w-1.5 h-5 rounded"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                />
                <h2 className="text-sm font-bold text-gray-800">
                  {date} 작성된 공지사항
                </h2>
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                />
              </div>

              <div className="grid gap-4">
                {groupedNotifications[date].map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onDetailClick={openDetailModal}
                    formatDate={formatDate}
                    truncateContent={truncateContent}
                  />
                ))}
              </div>
            </section>
          ))}
      </div>

      {showDetailModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                <div className="flex items-center text-sm text-gray-500 gap-4">
                  <span>
                    작성일: {formatDate(selectedNotification.createdAt)}
                  </span>
                  <span>
                    수정일: {formatDate(selectedNotification.updatedAt)}
                  </span>
                  <span>조회수: {selectedNotification.viewCount}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[300px]">
                  <p className="text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                    {selectedNotification.content}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => openEditForm(selectedNotification)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  수정하기
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleDeleteNotification(selectedNotification.id);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  삭제하기
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationCard({
  notification,
  onDetailClick,
  formatDate,
  truncateContent,
}) {
  return (
    <article className="relative rounded-xl border bg-white shadow-sm overflow-hidden transition hover:shadow-md">
      <div
        className="h-1"
        style={{ backgroundColor: 'var(--primary-color)' }}
      />

      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] rounded bg-gray-100 text-gray-700">
                #{notification.id}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] rounded bg-blue-50 text-blue-700">
                공지사항
              </span>
            </div>

            <h3 className="mt-2 font-medium text-sm text-gray-900 break-all">
              {notification.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 break-words line-clamp-2">
              {truncateContent(notification.content)}
            </p>

            <p className="mt-2 text-[11px] text-gray-400">
              작성일: {formatDate(notification.createdAt)} · 조회수:{' '}
              {notification.viewCount}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onDetailClick(notification)}
              className="px-3 py-1.5 text-sm rounded bg-gray-50 hover:bg-gray-100 border"
            >
              자세히
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
