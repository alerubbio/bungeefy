import React from 'react';

interface UserProfileProps {
  profile: {
    display_name: string;
    email: string;
    images: { url: string }[];
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ profile }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">Welcome, {profile.display_name}</h2>
      <p>Email: {profile.email}</p>
      {profile.images && profile.images[0] && (
        <img 
          src={profile.images[0].url} 
          alt="Profile" 
          className="w-16 h-16 rounded-full mt-2"
        />
      )}
    </div>
  );
};

export default UserProfile;