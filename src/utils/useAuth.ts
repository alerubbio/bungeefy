import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
};

export default function useAuth(code: string | null) {
  const [accessToken, setAccessToken] = useState<string | null>(() => 
    localStorage.getItem(LOCALSTORAGE_KEYS.accessToken)
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(() => 
    localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken)
  );
  const [expiresIn, setExpiresIn] = useState<number | null>(() => {
    const expiry = localStorage.getItem(LOCALSTORAGE_KEYS.expireTime);
    return expiry ? parseInt(expiry) : null;
  });
  const [refreshing, setRefreshing] = useState(false);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken || refreshing) return;

    setRefreshing(true);
    try {
      console.log('Refreshing access token');
      const response = await axios.get(`http://localhost:5000/refresh_token?refresh_token=${refreshToken}`);
      console.log('Token refreshed successfully');
      
      const { access_token, expires_in } = response.data;
      setAccessToken(access_token);
      setExpiresIn(expires_in);
      
      const currentTime = Math.floor(Date.now() / 1000);
      localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, access_token);
      localStorage.setItem(LOCALSTORAGE_KEYS.expireTime, (currentTime + expires_in).toString());
      localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, currentTime.toString());
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    } finally {
      setRefreshing(false);
    }
  }, [refreshToken, refreshing]);

  const refreshAccessTokenIfNeeded = useCallback(async () => {
    if (!refreshToken || !expiresIn || refreshing) return;

    const expirationTime = parseInt(localStorage.getItem(LOCALSTORAGE_KEYS.expireTime) || '0');
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime >= expirationTime - 300) { // Refresh if within 5 minutes of expiration
      await refreshAccessToken();
    }
  }, [refreshToken, expiresIn, refreshing, refreshAccessToken]);

  const logout = useCallback(() => {
    for (const key in LOCALSTORAGE_KEYS) {
      localStorage.removeItem(LOCALSTORAGE_KEYS[key as keyof typeof LOCALSTORAGE_KEYS]);
    }
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresIn(null);
    window.location.href = '/';
  }, []);

  useEffect(() => {
    if (!code) return;
    
    console.log('Initiating login with code:', code);
    axios.post('http://localhost:5000/login', { code })
      .then(res => {
        console.log('Received tokens from login');
        const { accessToken, refreshToken, expiresIn, timestamp } = res.data;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setExpiresIn(expiresIn);
        localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, accessToken);
        localStorage.setItem(LOCALSTORAGE_KEYS.refreshToken, refreshToken);
        localStorage.setItem(LOCALSTORAGE_KEYS.expireTime, (timestamp + expiresIn).toString());
        localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, timestamp.toString());
        window.history.pushState({}, '', '/');
      })
      .catch((error) => {
        console.error('Error in login:', error);
        window.location.href = '/';
      });
  }, [code]);

  useEffect(() => {
    if (!accessToken || !expiresIn) return;

    const interval = setInterval(refreshAccessTokenIfNeeded, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [accessToken, expiresIn, refreshAccessTokenIfNeeded]);

  return { accessToken, logout, refreshAccessTokenIfNeeded };
}