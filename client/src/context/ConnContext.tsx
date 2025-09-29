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

  const SERVER_TIME_INTERVAL = 6000;
  const URL = 'http://192.168.100.10:3000';

  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  const [lastKnownLocation, setLastKnownLocation] = useState<Location.LocationObject | null>(null);
  const lastKnownLocationRef = useRef<Location.LocationObject | null>(null);
  const [gpsTimeInterval, setGpsTimeInterval] = useState(5000);
  const [gpsPermissionGranted, setGpsPermissionGranted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { tokens, nickname } = useAuthContext();

  useEffect(function askGpsPermissions() {
    Location.getForegroundPermissionsAsync()
      .then(({ status: permission }) => {
        console.log('permission', permission);
        if (permission === 'granted') setGpsPermissionGranted(true);
        else Location.requestForegroundPermissionsAsync()
          .then(({ status: permission }) => setGpsPermissionGranted(permission === 'granted'))
          .catch(err => console.error('Error requesting GPS permissions:', err));
      })
      .catch(err => console.error('Error checking GPS permissions:', err));
  }, []);

  useEffect(function startIoWebSocket() {
    if (!socketRef.current) socketRef.current = io(URL, { transports: ['websocket'] });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(function startLocationWatcher() {
    console.log('Starting location watcher with interval:', gpsTimeInterval);
    console.log('GPS permission granted:', gpsPermissionGranted);
    if (!gpsPermissionGranted) return;

    let locationSubscription: Location.LocationSubscription | null = null;

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: gpsTimeInterval,
        distanceInterval: 0,
      }
      , location => {
        setLastKnownLocation(location);
        console.log('Location received: ', location);
      }, error => console.log('error occurred watching location:', error))
      .then(subscription => {
        console.log('Location watcher started', subscription);
        locationSubscription = subscription
      }
      ).catch(error => console.error('Error starting location watcher:', error));

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
        locationSubscription = null;
        setLastKnownLocation(null);
        console.log('Location watcher stopped');
      }
    }
  }, [gpsPermissionGranted, gpsTimeInterval]);

  useEffect(function updateLastKnownLocation() {
    lastKnownLocationRef.current = lastKnownLocation;
    console.log('Last known location updated:', lastKnownLocation);
  }, [lastKnownLocation]);

  useEffect(function reportLocationToServer() {
    if (!nickname || !tokens?.idToken || !gpsPermissionGranted) {
      console.log('Not reporting location: missing userId, token, or permission not granted');
      return;
    }

    const report = () => {
      const body = lastKnownLocationRef.current ? { ...lastKnownLocationRef.current, nickname: nickname, timestamp: new Date().toISOString() } : null;
      if (body) fetchFactory(URL + '/locations', 'POST', tokens?.idToken?.toString(), body)
        .then(res => {
          setIsConnected(true);
          console.log('Reported location to server:', res);
        })
        .catch(err => console.error('Error reporting location to server:', err));
    }
    report();
    const interval = setInterval(report, SERVER_TIME_INTERVAL);

    return () => {
      clearInterval(interval);
      console.log('GPS interval cleared');
    }

  }, [nickname, tokens, gpsPermissionGranted]);

  async function fetchData<T>(endpoint: string, method: HttpMethod, body: unknown = null): Promise<T | null> {
    if (!nickname) throw new Error('User not logged in, cannot fetch data');
    else return await fetchFactory<T>(URL + endpoint, method, tokens?.idToken?.toString(), body);
  }

  const contextValue: ConnContextType = {
    lastKnownLocation,
    socket: socketRef.current,
    setLastKnownLocation,
    setRunningMode: (runningMode: boolean) => runningMode ? setGpsTimeInterval(1000) : setGpsTimeInterval(5000),
    fetchData,
    isConnected
  };

  return (
    <ConnContext.Provider value={contextValue} >
      {children}
    </ConnContext.Provider >
  );
}