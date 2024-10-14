import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserProfile from './UserProfile';
import DashboardLayout from './DashboardLayout';
import useAuth from '../utils/useAuth';
import useDebouncedQuery from './hooks/useDebounce';

const fetchUserProfile = async (accessToken: string) => {
  if (!accessToken) throw new Error('No access token');
  
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.data;
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const code = new URLSearchParams(window.location.search).get('code');
  const { accessToken, logout, refreshAccessTokenIfNeeded } = useAuth(code);

  const { data: userProfile, error, isLoading } = useDebouncedQuery(
    ['userProfile', accessToken],
    () => fetchUserProfile(accessToken as string),
    {
      enabled: !!accessToken,
      retry: false,
    },
    2000 // 2 second delay
  );

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('spotifyAccessToken', accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (error && (error as any).response?.status === 401) {
      // Token expired, try to refresh
      refreshAccessTokenIfNeeded();
    }
  }, [error, refreshAccessTokenIfNeeded]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!accessToken) return <div className="text-white">Redirecting to login...</div>;
  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">An error occurred: {(error as Error).message}</div>;

  return (
    <div className="bg-[#24283B] min-h-screen p-4 text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Saved Tracks</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </header>
      
      {userProfile && <UserProfile profile={userProfile} />}

      {userProfile && <DashboardLayout />}
    </div>
  );
};

export default Landing;