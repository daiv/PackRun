
import React, { createContext, useContext, useState, useEffect } from 'react';

type RunContextType = {
    elapsedTime: number;
    stillRunning: boolean;
    startRun: () => void;
    stopRun: () => void;
    resetRun: () => void;
};

const RunContext = createContext<RunContextType>({
    elapsedTime: 0,
    stillRunning: false,
    startRun: () => {},
    stopRun: () => {},
    resetRun: () => {},
});

export const RunProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [stillRunning, setStillRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (stillRunning) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [stillRunning]);

    const startRun = () => setStillRunning(true);
    const stopRun = () => {
        setStillRunning(false)
        setElapsedTime(0)
    }
    const resetRun = () => setElapsedTime(0);

    return (
        <RunContext.Provider value={{ elapsedTime, stillRunning, startRun, stopRun, resetRun }}>
            {children}
        </RunContext.Provider>
    );
};

export const useRun = () => useContext(RunContext);