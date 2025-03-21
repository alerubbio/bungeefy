import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const Callback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const processedRef = useRef(false);

  const handleLogin = useCallback(async (code: string) => {
    if (processedRef.current) return;
    processedRef.current = true;

    console.log('Attempting to exchange code for token...');
    try {
      const response = await axios.post(`${API_URL}/login`, { code });
      console.log('Server response:', response.data);
      const { accessToken, refreshToken, expiresIn } = response.data;
      
      localStorage.setItem('spotifyAccessToken', accessToken);
      localStorage.setItem('spotifyRefreshToken', refreshToken);
      localStorage.setItem('spotifyTokenExpiry', (Date.now() + expiresIn * 1000).toString());
      
      console.log('Tokens stored successfully, redirecting to dashboard');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error in login API call:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
        console.error('Error headers:', err.response.headers);
      }
      setError('Failed to authenticate with Spotify');
    }
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    console.log('Authorization code from URL:', code);

    if (code && !processedRef.current) {
      handleLogin(code);
    } else if (!code) {
      console.error('No authorization code found in the URL');
      setError('No authorization code found in the URL');
    }
  }, [location, handleLogin]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Authenticating with Spotify...</div>;
};

export default Callback;