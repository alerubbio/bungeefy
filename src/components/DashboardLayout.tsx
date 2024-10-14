import React from 'react';
import AlbumGrid from './AlbumGrid';
import TrackDetail from './TrackDetail';
import TrackInfo from './TrackInfo';
import { DashboardProvider, useDashboard } from './DashboardContext';

const DashboardContent: React.FC = () => {
  const { setHoveredTrack } = useDashboard();

  const handleTrackHover = (track: any) => {
    setHoveredTrack(track);
  };

  const handleTrackLeave = () => {
    setHoveredTrack(null);
  };

  return (
    <div className="flex h-[calc(100vh-300px)]">
      <div className="w-1/4 h-full">
        <AlbumGrid />
      </div>
      <div className="w-3/4 p-4 overflow-y-auto flex">
        <div className="w-1/3">
          <TrackDetail onHover={handleTrackHover} onLeave={handleTrackLeave} />
        </div>
        <div className="w-2/3">
          <TrackInfo />
        </div>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default DashboardLayout;