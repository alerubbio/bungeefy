import React from 'react';
import { useDashboard } from './DashboardContext';

interface TrackDetailProps {
  onHover: (track: any) => void;
  onLeave: () => void;
}

const TrackDetail: React.FC<TrackDetailProps> = ({ onHover, onLeave }) => {
  const { hoveredTrack, selectedTrack } = useDashboard();

  const trackToShow = hoveredTrack || selectedTrack;

  if (!trackToShow) return null;

  return (
    <div className="ml-8 mb-4 mt-6 max-w-[500px]">
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => onHover(trackToShow)}
        onMouseLeave={onLeave}
      >
        <img
          loading='eager'
          src={trackToShow.album.images[0].url}
          alt={`${trackToShow.album.name} cover`} 
          className="w-full h-auto object-cover mb-2"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-15 transition-opacity duration-200" />
      </div>
      <h2 className="text-xl font-bold mt-2">{trackToShow.name}</h2>
      <p className="text-gray-300">{trackToShow.artists.map(a => a.name).join(', ')}</p>
      <p className="text-gray-300">{trackToShow.album.name}</p>
    </div>
  );
};

export default TrackDetail;