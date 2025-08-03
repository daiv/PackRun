import React, { createContext, useEffect, useState, useRef, useContext, useCallback } from 'react';
import * as Location from 'expo-location';
import { fetchFactory } from '../helpers/helper';
import { ConnContextType, HttpMethod } from '../helpers/Types';
import { useAuthContext } from './AuthContext';
import io from 'socket.io-client';

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
  const URL = 'http://192.168.100.18:3000';

  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  const [lastKnownLocation, setLastKnownLocation] = useState<Location.LocationObject | null>(null);
  const lastKnownLocationRef = useRef<Location.LocationObject | null>(null);
  const [gpsTimeInterval, setGpsTimeInterval] = useState(55000);
  const { tokens, userId } = useAuthContext();

  useEffect(() => {
    if (!socketRef.current) socketRef.current = io(URL, { transports: ['websocket'] });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(function updateLastKnownLocation() {
    lastKnownLocationRef.current = lastKnownLocation;
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
  // useEffect(function getStadia(){}, [userId]);

  useEffect(function reportLocationToServer() {
    console.log('USERIDCHANGED to', userId);
    if (userId) {
      const report = () => {
        const body = lastKnownLocationRef.current ? { ...lastKnownLocationRef.current, userId, timestamp: new Date().toISOString() } : null;
        if (body) fetchFactory(URL + '/locations', 'POST', tokens?.idToken?.toString(), body)
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

  async function fetchData<T>(endpoint: string, addUserIdToUrl: boolean, method: HttpMethod, body: unknown = null): Promise<T | null> {
    if (!userId) throw new Error('User not logged in, cannot fetch data');
    else return await fetchFactory<T>(URL + endpoint + (addUserIdToUrl ? userId : ''), method, tokens?.idToken?.toString(), body);
  }

  const contextValue: ConnContextType = {
    lastKnownLocation,
    socket: socketRef.current,
    setLastKnownLocation,
    setRunningMode: (runningMode: boolean) => runningMode ? setGpsTimeInterval(1000) : setGpsTimeInterval(5000),
    fetchData,
  };

  return (
    <ConnContext.Provider value={contextValue} >
      {children}
    </ConnContext.Provider >
  );
} 