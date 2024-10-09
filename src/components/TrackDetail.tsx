import React, { useRef, useEffect } from 'react';
import { useDashboard } from './DashboardContext';

const TrackDetail: React.FC = () => {
  const { hoveredTrack, selectedTrack, volume } = useDashboard();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const trackToShow = selectedTrack || hoveredTrack;

  useEffect(() => {
    if (trackToShow?.preview_url && audioRef.current) {
      audioRef.current.src = trackToShow.preview_url;
      audioRef.current.volume = volume;
    }
  }, [trackToShow, volume]);

  const handleMouseEnter = () => {
    if (audioRef.current && trackToShow?.preview_url) {
      audioRef.current.play().catch(error => console.error("Audio playback failed", error));
    }
  };

  const handleMouseLeave = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  if (!trackToShow) return null;

  return (
    <div className="ml-32 mb-4 mt-6">
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          loading='eager'
          src={trackToShow.album.images[0].url}
          alt={`${trackToShow.album.name} cover`} 
          className="w-track-detail h-auto object-cover mb-2"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-15 flex items-center justify-center transition-opacity duration-200">
        </div>
      </div>
      <h2 className="text-xl font-bold">{trackToShow.name}</h2>
      <p className="text-gray-300">{trackToShow.artists.map(a => a.name).join(', ')}</p>
      <p className="text-gray-300">{trackToShow.album.name}</p>
      <audio ref={audioRef} />
    </div>
  );
};

export default TrackDetail;