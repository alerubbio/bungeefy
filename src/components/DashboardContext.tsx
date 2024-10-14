import React, { createContext, useState, useContext } from 'react';

interface Track {
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  id?: string;
  preview_url: string | null;  // Added preview_url
}

interface DashboardContextType {
  hoveredTrack: Track | null;
  setHoveredTrack: (track: Track | null) => void;
  selectedTrack: Track | null;
  setSelectedTrack: (track: Track | null) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoveredTrack, setHoveredTrack] = useState<Track | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(0.5);  // Initial volume set to 50%

  return (
    <DashboardContext.Provider value={{ 
      hoveredTrack, 
      setHoveredTrack, 
      selectedTrack, 
      setSelectedTrack,
      volume,
      setVolume
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};