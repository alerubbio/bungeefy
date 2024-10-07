import React, { useState, useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import { useDashboard } from './DashboardContext';
import {ScrollShadow} from "@nextui-org/react";

interface SavedTrack {
  added_at: string;
  track: {
    album: {
      images: { url: string; width: number; height: number }[];
      name: string;
    };
    name: string;
    artists: { name: string }[];
  };
}

const fetchTracks = async ({ pageParam = 0 }) => {
  const accessToken = localStorage.getItem('spotifyAccessToken');
  if (!accessToken) throw new Error('No access token');
  
  const response = await axios.get(`https://api.spotify.com/v1/me/tracks`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
    params: { limit: 50, offset: pageParam }
  });
  return response.data;
};

const IMAGE_SIZES = [
  { index: 0, size: 640, name: 'Large' },
  { index: 0, size: 300, name: 'Medium' },
  { index: 0, size: 40, name: 'Small' },
];

export default function AlbumGrid() {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(2);
  const { setHoveredTrack } = useDashboard();
  const { ref, inView } = useInView({
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '200px', // Start loading 200px before the element comes into view
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery('tracks', fetchTracks, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length * 50;
      }
      return undefined;
    },
  });

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  React.useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <div>An error occurred</div>;

  const selectedSize = IMAGE_SIZES[selectedSizeIndex].size;

  return (
    <ScrollShadow hideScrollBar className="h-full bg-white pt-2">
      <div className="max-w-full px-4">
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${selectedSize}px, 1fr))`,
          }}
        >
          {data?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.items.map((item: SavedTrack, index: number) => {
                const image = item.track.album.images[0];
                return (
                  <div
                    key={index}
                    className="aspect-square relative group"
                    onMouseEnter={() => setHoveredTrack(item.track)}
                    onMouseLeave={() => setHoveredTrack(null)}
                  >
                    <img
                      src={image?.url}
                      alt={`${item.track.album.name} cover`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={selectedSize}
                      height={selectedSize}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 flex items-center justify-center transition-opacity duration-200 rounded-md">
                      <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2">
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div ref={ref} className="mt-4 text-center">
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? <button onClick={loadMore} className="px-4 py-2 bg-blue-500 text-white rounded">
                Load More
              </button>
            : "No more tracks to load"}
        </div>
      </div>
    </ScrollShadow>
  );
}