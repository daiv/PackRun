import React, { createContext, useEffect, useState, useRef, useContext } from 'react';
import * as Location from 'expo-location';
import { fetchFactory } from '../helpers/helper';
import { ConnContextType } from '../helpers/Types';


const ConnContext = createContext<ConnContextType | null>(null);

export const useConnContext = () => {
  const context = useContext(ConnContext);
  if (context === null) {
    throw new Error('useConnContext must be used within a ConnProvider');
  }
  return context;
}

export const ConnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const SERVER_TIME_INTERVAL = 60000;

  const [lastKnownLocation, setLastKnownLocation] = useState<Location.LocationObject | null>(null);
  const lastKnownLocationRef = useRef<Location.LocationObject | null>(null);
  const [gpsTimeInterval, setGpsTimeInterval] = useState(55000);
  const [userId, setUserId] = useState('');

  let locationUpdateCallback: React.Dispatch<React.SetStateAction<Location.LocationObject | null>> | null = null;
  
  const setLocationUpdateCallback = (callback: React.Dispatch<React.SetStateAction<Location.LocationObject | null>>) => {
    if (callback) locationUpdateCallback = callback;
  }

  useEffect(function updateLastKnownLocation() {
    lastKnownLocationRef.current = lastKnownLocation;
    if (locationUpdateCallback && lastKnownLocation) locationUpdateCallback(lastKnownLocation);
    console.log('Last known location updated:', lastKnownLocation);
  }, [lastKnownLocation]);

  useEffect(function startLocationWatcher() {
    console.log('Starting location watcher with interval:', gpsTimeInterval);
    let locationSubscription: Location.LocationSubscription | null = null;
    Location.requestForegroundPermissionsAsync()
      .then(permission => {
        if (permission.status === 'granted') {

          Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: gpsTimeInterval,
              distanceInterval: 0,
            }
            , setLastKnownLocation)
            .then(subscription => locationSubscription = subscription);

        } else console.error('Permission to access location was denied');
      })
      .catch(error => console.error('Error requesting location permissions:', error));

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
        locationSubscription = null;
        setLastKnownLocation(null);
        console.log('Location watcher stopped');
      }
    }
  }, [gpsTimeInterval]);

  useEffect(function reportToServer() {
    if (userId) {
      const report = () => {
        const body = lastKnownLocationRef.current ? { ...lastKnownLocationRef.current, userId, timestamp: new Date().toISOString() } : null;
        if (body) fetchFactory('/locations', 'POST', body)
          .then(res => console.log('Reported location to server:', res))
          .catch(err => console.error('Error reporting location to server:', err));
      }
      report();
      const interval = setInterval(report, SERVER_TIME_INTERVAL);

      return () => {
        clearInterval(interval);
        console.log('GPS interval cleared');
      }
    }
  }, [userId]);

  const contextValue: ConnContextType = {
    userId,
    setUserId,
    lastKnownLocation,
    setRunningMode: (runningMode: boolean) => runningMode ? setGpsTimeInterval(1000) : setGpsTimeInterval(5000),
    setLocationUpdateCallback

  };

  return (
    <ConnContext.Provider value={contextValue} >
      {children}
    </ConnContext.Provider >
  );
} 