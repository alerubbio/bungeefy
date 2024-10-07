import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import UserProfile from './UserProfile';
import DashboardLayout from './DashboardLayout';

const fetchUserProfile = async () => {
  const accessToken = localStorage.getItem('spotifyAccessToken');
  if (!accessToken) throw new Error('No access token');
  
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.data;
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { data: userProfile, error, isLoading } = useQuery('userProfile', fetchUserProfile);

  const handleLogout = () => {
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('spotifyRefreshToken');
    localStorage.removeItem('spotifyTokenExpiry');
    navigate('/');
  };

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

      <DashboardLayout/>
    </div>
  );
};

export default Landing;