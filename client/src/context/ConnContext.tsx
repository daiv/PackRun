import React, { createContext, useEffect, useState, useRef, useContext, useCallback, useMemo } from 'react';
import * as Location from 'expo-location';
import { fetchFactory } from '../helpers/helper';
import { ConnContextType, FetchDataResult, HttpMethod } from '../types/types';
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
  const { tokens, userId, setNickName } = useAuthContext();

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
    if (!socketRef.current && tokens) socketRef.current = io(URL, { transports: ['websocket'], auth: { token: tokens?.idToken?.toString() } });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [tokens]);

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

  const fetchData = useCallback(async<T,>(endpoint: string, method: HttpMethod, body: unknown = null): Promise<FetchDataResult<T>> => {
    if (!userId) return { success: false, error: 'User not logged in, cannot fetch data' };
    try {
      const data = await fetchFactory<T>(URL + endpoint, method, tokens?.idToken?.toString(), body);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message || 'Unknown error' };
    }

  }, [userId, tokens]);
  
  useEffect(function reportLocationToServer() {
    if (!userId || !tokens?.idToken || !gpsPermissionGranted) {
      console.log('Not reporting location: missing userId, token, or permission not granted');
      return;
    }

    const reportLocation = async () => {
      const body = lastKnownLocationRef.current ? { ...lastKnownLocationRef.current, timeStamp: new Date().toISOString() } : null;
      if (body) {
        const reportResponse = await fetchData<{ assignedChatRoom: string, nickName: string }>('/locations', 'POST', body);
        setIsConnected(reportResponse.success);
        reportResponse.success && setNickName(reportResponse.data?.nickName ? reportResponse.data?.nickName : null);
      }
    }
    reportLocation();
    const interval = setInterval(reportLocation, SERVER_TIME_INTERVAL);

    return () => {
      clearInterval(interval);
      console.log('GPS interval cleared');
    }

  }, [userId, tokens, gpsPermissionGranted]);

  const setRunningMode = useCallback((runningMode: boolean) => runningMode ? setGpsTimeInterval(1000) : setGpsTimeInterval(5000), []);

  const contextValue = useMemo(() => ({
    lastKnownLocation,
    socket: socketRef.current,
    setLastKnownLocation,
    setRunningMode,
    fetchData,
    isConnected
  }),
    [lastKnownLocation,
      socketRef,
      setLastKnownLocation,
      setRunningMode,
      fetchData,
      isConnected
    ]);

  return (
    <ConnContext.Provider value={contextValue} >
      {children}
    </ConnContext.Provider >
  );
}