import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Make sure this matches your Express server URL

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasAttemptedLogin = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    console.log('Authorization code from URL:', code);

    if (code && !hasAttemptedLogin.current) {
      hasAttemptedLogin.current = true;
      
      axios.post(`${API_URL}/login`, { code })
        .then(response => {
          console.log('Server response:', response.data);
          const { accessToken, refreshToken, expiresIn } = response.data;
          
          localStorage.setItem('spotify_access_token', accessToken);
          localStorage.setItem('spotify_refresh_token', refreshToken);
          localStorage.setItem('spotify_token_expire_time', (Date.now() + expiresIn * 1000).toString());
          
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('Error in login API call:', error);
          if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
          }
          navigate('/');
        });
    } else if (!code) {
      console.error('No authorization code found in the URL');
      navigate('/');
    }
  }, [location, navigate]);

  return <div>Authenticating with Spotify...</div>;
};

export default Callback;