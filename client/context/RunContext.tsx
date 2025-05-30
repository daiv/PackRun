
import { createTrackOnServer, postLocationToServerTrack } from '../helpers/helper';
import React, { createContext, useEffect, useContext, useState } from 'react';
import { RunContextType } from '../helpers/Types';
import { useConnContext } from './ConnContext';
import Location from 'expo-location';
import { Alert } from 'react-native';

interface RunProviderProps {
  children: React.ReactNode;
}

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
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [lastKnownLocation, setLastKnownLocation] = useState<Location.LocationObject | null>(null);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [distanceRan, setDistanceRan] = useState(0);
  const [reportedLocations, setReportedLocations] = useState<{ latitude: number; longitude: number }[]>([]);
  const { setRunningMode, setLocationUpdateCallback, USER_ID } = useConnContext();

  setLocationUpdateCallback(setLastKnownLocation);

  useEffect(function startRun() {
    let clockTimer: NodeJS.Timeout | null = null;
    if (isRunning) {
      setRunningMode(true);
      setTimeElapsed(0);
      setDistanceRan(0);
      setReportedLocations([]);
      clockTimer = setInterval(() => setTimeElapsed(timeElapsed => timeElapsed + 1), 1000);
    }
    return () => {
      if (clockTimer) clearInterval(clockTimer);
      setRunningMode(false);
    };
  }, [isRunning]);

  useEffect(function updateServerWithLastKnownLocation() {
    if (lastKnownLocation && isRunning && trackId) {
      const { latitude, longitude } = lastKnownLocation.coords;
      postLocationToServerTrack(USER_ID, trackId, lastKnownLocation).then(response => {
        setReportedLocations([...reportedLocations, { latitude, longitude }]);
        console.log('Location posted to server:', response);
        //setDistanceRan(response.features[0].properties.distance | 0);
      }).catch(error => {
        console.error('Error posting location to server:', error.message);
      });

    }

  }, [lastKnownLocation]);
  async function toogleRunning() {
    if (isRunning) setIsRunning(false);
    else {
      try {
        const response = await createTrackOnServer(USER_ID);
        if (response.trackId) {
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
    timeElapsed,
    setTimeElapsed,
    lastKnownLocation,
    toogleRunning,
    distanceRan,
    reportedLocations
  };

  return (
    <RunContext.Provider value={contextValue}>
      {children}
    </RunContext.Provider >);
}