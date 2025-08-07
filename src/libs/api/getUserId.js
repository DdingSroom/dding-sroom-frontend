import axiosInstance from './instance.js';

const getUserId = async () => {
  try {
    const response = await axiosInstance.get('/api/users/token-userid');
    console.log(response);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error('no user id data');
    }
  } catch (e) {
    console.error(e);
  }
};

export default getUserId;
