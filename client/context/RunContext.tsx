
import React, { createContext, useEffect } from 'react';

type RunContextType = {
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  timeElapsed: number;
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>;
};

interface RunProviderProps {
  children: React.ReactNode;
}
export const RunContext = createContext<RunContextType | null>(null);

export const RunProvider: React.FC<RunProviderProps> = ({ children }) => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeElapsed, setTimeElapsed] = React.useState(0);

  useEffect(() => {
    if (isRunning) {
      setTimeElapsed(0);
      const timer = setInterval(() => setTimeElapsed(timeElapsed => timeElapsed + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning]);

  const contextValue: RunContextType = {
    isRunning,
    setIsRunning,
    timeElapsed,
    setTimeElapsed
  };

  return (
    <RunContext.Provider value={contextValue}>
      {children}
    </RunContext.Provider >);
}