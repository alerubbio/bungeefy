import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useDashboard } from './DashboardContext';
import axios from 'axios';

interface AudioFeatures {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  valence: number;
  tempo: number;
}

const TrackInfo: React.FC = () => {
  const { selectedTrack } = useDashboard();
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null);

  useEffect(() => {
    const fetchAudioFeatures = async () => {
      if (selectedTrack?.id) {
        try {
          const accessToken = localStorage.getItem('spotify_access_token');
          const response = await axios.get(`https://api.spotify.com/v1/audio-features/${selectedTrack.id}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          setAudioFeatures(response.data);
        } catch (error) {
          console.error('Error fetching audio features:', error);
        }
      }
    };

    fetchAudioFeatures();
  }, [selectedTrack]);

  if (!selectedTrack || !audioFeatures) {
    return null;
  }

  const audioFeaturesData = [
    { feature: 'Acousticness', value: audioFeatures.acousticness },
    { feature: 'Danceability', value: audioFeatures.danceability },
    { feature: 'Energy', value: audioFeatures.energy },
    { feature: 'Instrumentalness', value: audioFeatures.instrumentalness },
    // { feature: 'Liveness', value: audioFeatures.liveness },
    // { feature: 'Speechiness', value: audioFeatures.speechiness },
    { feature: 'Valence', value: audioFeatures.valence },
    { feature: 'Loudness', value: (audioFeatures.loudness + 60) / 60 }, // Normalizing loudness
    { feature: 'Tempo', value: audioFeatures.tempo / 200 } // Normalizing tempo
  ];

  return (
    <Card className="h-2/5 w-2/5 ml-16" radius='none'>
      <CardHeader>
        <h2 className="text-2xl font-bold">Audio Features: {selectedTrack.name}</h2>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={audioFeaturesData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="feature" label={{ value: 'Energy', fill: 'red' }}/>
            <PolarRadiusAxis angle={20} domain={[0, 1]} />
            <Radar name="Audio Features" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.8} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardBody>
      {/* <CardFooter>
        <Button color="primary">Get Recommendations</Button>
      </CardFooter> */}
    </Card>
  );
};

export default TrackInfo;