import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useDashboard } from './DashboardContext';
import VolumeSlider from './VolumeSlider';
import LoadingAnimation from './LoadingAnimation';

interface SavedTrack {
  added_at: string;
  track: {
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

const ITEM_SIZE = 40; // Size of each grid item

export default function AlbumGrid() {
  const { setHoveredTrack, setSelectedTrack, volume, setVolume } = useDashboard();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const { data: tracks, status } = useQuery('allTracks', fetchAllTracks, {
    staleTime: Infinity, // Keep data fresh indefinitely
  });

  const handleMouseEnter = useCallback((track: SavedTrack['track']) => {
    setHoveredTrack(track);
    if (track.preview_url && audioRef.current) {
      audioRef.current.src = track.preview_url;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(error => console.error("Audio playback failed", error));
    }
  }, [setHoveredTrack, volume]);

  const handleMouseLeave = useCallback(() => {
    setHoveredTrack(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [setHoveredTrack]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, [setVolume]);

  const Cell = useCallback(({ columnIndex, rowIndex, style, data }: any) => {
    const { tracks, columnCount } = data;
    const index = rowIndex * columnCount + columnIndex;
    const item = tracks[index];
    if (!item) return null;

    const image = item.track.album.images.find((img: { width: number; }) => img.width === 64) || item.track.album.images[0];
    return (
      <div
        style={{
          ...style,
          width: ITEM_SIZE,
          height: ITEM_SIZE,
        }}
        onMouseEnter={() => handleMouseEnter(item.track)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setSelectedTrack(item.track)}
        className="relative group cursor-pointer"
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
  }, [handleMouseEnter, handleMouseLeave, setSelectedTrack]);

  if (status === 'loading') return <LoadingAnimation/>;
  if (status === 'error') return <div>An error occurred</div>;

  return (
    
    <div className="h-full bg-white pt-4">
      <div className="px-4 mb-4">
        <VolumeSlider />
      </div>
      <div className="h-[calc(100%-60px)]">
        <AutoSizer>
          {({ height, width }) => {
            const columnCount = Math.floor(width / ITEM_SIZE);
            const rowCount = Math.ceil((tracks?.length || 0) / columnCount);
            return (
              <Grid
                columnCount={columnCount}
                columnWidth={ITEM_SIZE}
                height={height}
                rowCount={rowCount}
                rowHeight={ITEM_SIZE}
                width={width}
                itemData={{ tracks, columnCount }}
              >
                {Cell}
              </Grid>
            );
          }}
        </AutoSizer>
      </div>
      <audio ref={audioRef} />
    </div>
  );
}