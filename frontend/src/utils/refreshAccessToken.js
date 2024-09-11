import axios from 'axios';

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post('http://localhost:4000/refresh-token', { refreshToken });
    return response.data.accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw new Error('Failed to refresh access token');
  }
};

export default refreshAccessToken