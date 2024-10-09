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
    <div className="ml-32 mb-4 mt-6 max-w-[500px]">
      <div className="relative group cursor-pointer">
        <img
          loading='eager'
          src={trackToShow.album.images[0].url}
          alt={`${trackToShow.album.name} cover`} 
          className="w-full h-auto object-cover mb-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-15 transition-opacity duration-200" />
      </div>
      <h2 className="text-xl font-bold mt-2">{trackToShow.name}</h2>
      <p className="text-gray-300">{trackToShow.artists.map(a => a.name).join(', ')}</p>
      <p className="text-gray-300">{trackToShow.album.name}</p>
      <audio ref={audioRef} />
    </div>
  );
};

export default TrackDetail;