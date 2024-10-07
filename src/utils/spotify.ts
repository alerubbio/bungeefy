import axios from 'axios';

const AUTH_URL = 'https://accounts.spotify.com/authorize';
const API_URL = 'http://localhost:5000'; // Your Express server URL

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative',
];

export const getAuthUrl = () => {
  return `${AUTH_URL}?client_id=${import.meta.env.VITE_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(import.meta.env.VITE_SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(scopes.join(' '))}`;
};

export const getAccessToken = async (code: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { code });
    return response.data;
  } catch (error) {
    console.error('Error getting access token', error);
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
    return response.data;
  } catch (error) {
    console.error('Error refreshing access token', error);
    throw error;
  }
};