import React from 'react';
import AlbumGrid from './AlbumGrid';
import TrackDetail from './TrackDetail';
import TrackInfo from './TrackInfo';
import { DashboardProvider } from './DashboardContext';

const DashboardLayout: React.FC = () => {
  return (
    <DashboardProvider>
      <div className="flex h-[calc(100vh-300px)]">
        <div className="w-1/4 h-full overflow-hidden">
          <AlbumGrid />
        </div>
        <div className="w-1/2 p-4 overflow-y-auto flex">
          <div className="w-1/2">
            <TrackDetail />
          </div>
          <div className="w-1/2">
            <TrackInfo />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;