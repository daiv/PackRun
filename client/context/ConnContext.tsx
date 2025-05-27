import React, { createContext, useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { fetchFactory } from '../helpers/helper';

const ConnContext = createContext<boolean>(false);

export const ConnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const getLastKnownLocation = () => lastKnownLocation;
  const [lastKnownLocation, setLastKnownLocation] = useState<Location.LocationObject | null>(null);
  const lastKnownLocationRef = useRef<Location.LocationObject | null>(null);
  const [gpsTimeInterval, setGpsTimeInterval] = useState(5000);
  const [serverTimeInterval, setServerTimeInterval] = useState(30000);
  const USER_ID = 'testUser';

  useEffect(() => {
    lastKnownLocationRef.current = lastKnownLocation;
    console.log('Last known location updated:', lastKnownLocation);
  }, [lastKnownLocation]);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    Location.requestForegroundPermissionsAsync()
      .then(permission => {
        if (permission.status === 'granted') {

          Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: gpsTimeInterval,
              distanceInterval: 1,
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
    const interval = setInterval(() => {
      const body = lastKnownLocationRef.current ? { ...lastKnownLocationRef.current, userId: USER_ID, timestamp: new Date().toISOString() } : null;
      if (body) fetchFactory('/locations', 'POST', body)
        .then(res => console.log('Reported location to server:', res))
        .catch(err => console.error('Error reporting location to server:', err));

    }, serverTimeInterval);
    return () => {
      clearInterval(interval);
      console.log('GPS interval cleared');
    }
  }, [serverTimeInterval]);

  return (
    <ConnContext.Provider value={false}>
      {children}
    </ConnContext.Provider>
  );
} 