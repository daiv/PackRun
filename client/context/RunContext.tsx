
import React, { createContext, useEffect, useContext } from 'react';
import { useConnContext } from './ConnContext';
import Location from 'expo-location';
import { RunContextType } from '../helpers/Types';

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
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeElapsed, setTimeElapsed] = React.useState(0);
  const [lastKnownLocation, setLastKnownLocation] = React.useState<Location.LocationObject | null>(null);

  const { setRunningMode, setLocationUpdateCallback, USER_ID } = useConnContext();

  setLocationUpdateCallback(setLastKnownLocation);

  useEffect(function startRun() {
    let clockTimer: NodeJS.Timeout | null = null;

    if (isRunning) {
      setRunningMode(true);
      setTimeElapsed(0);
      clockTimer = setInterval(() => setTimeElapsed(timeElapsed => timeElapsed + 1), 1000);
    }
    return () => {
      if (clockTimer) clearInterval(clockTimer);
      setRunningMode(false);
    };
  }, [isRunning]);

  const contextValue: RunContextType = {
    isRunning,
    setIsRunning,
    timeElapsed,
    setTimeElapsed,
    lastKnownLocation
  };

  return (
    <RunContext.Provider value={contextValue}>
      {children}
    </RunContext.Provider >);
}