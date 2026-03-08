import axiosInstance from './instance';

// 스터디룸 상태 변경 API
export const updateRoomStatus = async (roomId, status) => {
  const response = await axiosInstance.put(
    `/admin/rooms/${roomId}/status`,
    {},
    {
      params: { status },
    },
  );
  return response.data;
};

// 사용자 상태 변경 API
export const updateUserStatus = async (userId, status) => {
  const response = await axiosInstance.put(
    `/admin/users/${userId}/status`,
    {},
    {
      params: { status },
    },
  );
  return response.data;
};
