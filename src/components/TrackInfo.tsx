import React from 'react';
import { useDashboard } from './DashboardContext';

const TrackInfo: React.FC = () => {
  const { selectedTrack } = useDashboard();

  if (!selectedTrack) return null;

  return (
    <div className="ml-4">
      <h2 className="text-2xl font-bold mb-4">Track Information</h2>
      <p><strong>Track:</strong> {selectedTrack.name}</p>
      <p><strong>Artist(s):</strong> {selectedTrack.artists.map(a => a.name).join(', ')}</p>
      <p><strong>Album:</strong> {selectedTrack.album.name}</p>
      {/* Add more track information here as needed */}
    </div>
  );
};

export default TrackInfo;