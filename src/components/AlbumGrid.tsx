import React, { useCallback, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useDashboard } from './DashboardContext';
import VolumeSlider from './VolumeSlider';
import LoadingAnimation from './LoadingAnimation';

interface SavedTrack {
  added_at: string;
  track: {
    id: string;
    album: {
      images: { url: string; width: number; height: number }[];
      name: string;
    };
    name: string;
    artists: { name: string }[];
    preview_url: string | null;
  };
}

interface SpotifyResponse {
  items: SavedTrack[];
  next: string | null;
}

const fetchAllTracks = async (): Promise<SavedTrack[]> => {
  const accessToken = localStorage.getItem('spotify_access_token');
  if (!accessToken) throw new Error('No access token');

  let allTracks: SavedTrack[] = [];
  let next: string | null = 'https://api.spotify.com/v1/me/tracks?limit=50';

  while (next) {
    const response: { data: SpotifyResponse } = await axios.get(next, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    allTracks = [...allTracks, ...response.data.items];
    next = response.data.next;
  }

  return allTracks;
};

const ITEM_SIZE = 36; // Size of each grid item

export default function AlbumGrid() {
  const { setHoveredTrack, setSelectedTrack, volume, hoveredTrack } = useDashboard();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: tracks, status } = useQuery('allTracks', fetchAllTracks, {
    staleTime: Infinity,
  });

  const handleTrackHover = useCallback((track: SavedTrack['track']) => {
    setHoveredTrack(track);
  }, [setHoveredTrack]);

  const handleTrackLeave = useCallback(() => {
    setHoveredTrack(null);
  }, [setHoveredTrack]);

  useEffect(() => {
    if (hoveredTrack?.preview_url && audioRef.current) {
      audioRef.current.src = hoveredTrack.preview_url;
      audioRef.current.volume = volume;
      audioRef.current.play().catch((error: Error) => console.error("Audio playback failed", error));
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [hoveredTrack, volume]);

  const renderAlbum = useCallback((item: SavedTrack) => {
    const image = item.track.album.images.find((img: { width: number; }) => img.width === 64) || item.track.album.images[0];
    return (
      <div
        key={item.track.id}
        onMouseEnter={() => handleTrackHover(item.track)}
        onMouseLeave={handleTrackLeave}
        onClick={() => setSelectedTrack(item.track)}
        className="relative group cursor-pointer"
        style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
      >
        <img
          src={image?.url}
          alt={`${item.track.album.name} cover`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-opacity duration-200'></div>
      </div>
    );
  }, [handleTrackHover, handleTrackLeave, setSelectedTrack]);

  if (status === 'loading') return <LoadingAnimation/>;
  if (status === 'error') return <div>An error occurred</div>;

  return (
    <>
      <div className="p-0">
        <VolumeSlider />
      </div>
    <div className="flex flex-col h-full w-full bg-white">
      <div className="flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto p-4 pl-6 no-scrollbars">
          <div 
            className="grid gap-0"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(${ITEM_SIZE}px, 0fr))`,
              width: '100%',
            }}
            >
            {tracks?.map(renderAlbum)}
          </div>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
            </>
  );
}