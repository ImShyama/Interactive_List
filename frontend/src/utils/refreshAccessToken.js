import axios from 'axios';
import { HOST } from './constants';

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${HOST}/refresh-token`, { refreshToken });
    return response.data.accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw new Error('Failed to refresh access token');
  }
};

export default refreshAccessToken