import React from 'react';
import { useDashboard } from './DashboardContext';

const TrackDetail: React.FC = () => {
  const { hoveredTrack, selectedTrack } = useDashboard();

  const trackToShow = selectedTrack || hoveredTrack;

  if (!trackToShow) return null;

  return (
    <div className="ml-32 mb-4 mt-6">
      <img
        loading='eager'
        src={trackToShow.album.images[0].url}
        alt={`${trackToShow.album.name} cover`} 
        className="w-track-detail h-auto object-cover mb-2"
      />
      <h2 className="text-xl font-bold">{trackToShow.name}</h2>
      <p className="text-gray-300">{trackToShow.artists.map(a => a.name).join(', ')}</p>
      <p className="text-gray-300">{trackToShow.album.name}</p>
    </div>
  );
};

export default TrackDetail;