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
      <div className="w-1/4 h-full overflow-hidden">
        <AlbumGrid />
      </div>
      <div className="w-1/2 p-4 overflow-y-auto flex">
        <div className="w-1/2">
          <TrackDetail onHover={handleTrackHover} onLeave={handleTrackLeave} />
        </div>
        <div className="w-1/2">
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