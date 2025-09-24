import React, { createContext, useEffect, useContext, useState } from 'react';
import { RunContextType, RunProviderProps } from '../helpers/Types';
import { useConnContext } from './ConnContext';
import { Alert } from 'react-native';
import { FeatureCollection } from 'geojson';

const RunContext = createContext<RunContextType | undefined>(undefined);

export const useRunContext = () => {
  const context = useContext(RunContext);
  if (context === undefined) {
    throw new Error('useRunContext must be used within a RunProvider');
  }
  return context;
};

export const RunProvider: React.FC<RunProviderProps> = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [metersRan, setMetersRan] = useState(0);
  const [route, setRoute] = useState<GeoJSON.FeatureCollection | null>();
  const { setRunningMode, lastKnownLocation, fetchData } = useConnContext();


  useEffect(function startRun() {
    let clockTimer: number | null = null;
    if (isRunning) {
      setRunningMode(true);
      setSecondsElapsed(0);
      setMetersRan(0);
      setRoute(undefined);
      clockTimer = setInterval(() => setSecondsElapsed(secondsElapsed => secondsElapsed + 1), 1000);
    }
    return () => {
      if (clockTimer) clearInterval(clockTimer);
      setRunningMode(false);
    };
  }, [isRunning]);

  useEffect(function updateServerWithLastKnownLocation() {
    if (lastKnownLocation && isRunning && trackId) {
      fetchData<FeatureCollection | null>(`/tracks/${trackId}/`, true, 'POST', lastKnownLocation).then(setRoute);
    }

  }, [lastKnownLocation]);

  async function toogleRunning() {
    if (isRunning) setIsRunning(false);
    else {
      try {
        const response = await fetchData<{ trackId: string }>('/tracks/', true, 'PUT', null);
        if (response?.trackId) {
          console.log('Track created with ID:', response.trackId);
          setTrackId(response.trackId);
          setIsRunning(true);
        }
      } catch (error) {
        Alert.alert('Error Failed to start the run. Please try again later.');
      }
    }
  }

  const contextValue: RunContextType = {
    isRunning,
    secondsElapsed,
    setSecondsElapsed,
    lastKnownLocation,
    toogleRunning,
    metersRan,
    route
  };

  return (
    <RunContext.Provider value={contextValue}>
      {children}
    </RunContext.Provider >);
}