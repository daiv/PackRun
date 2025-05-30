import * as Location from 'expo-location';

export interface Runner {
  userId: string,
  latitude: number,
  longitude: number
}
export type connContextType = {
  USER_ID: string;
  lastKnownLocation: Location.LocationObject | null;
  setRunningMode: (arg0: boolean) => void;
  setLocationUpdateCallback: (callback: React.Dispatch<React.SetStateAction<Location.LocationObject | null>>) => void;
}

export type RunContextType = {
  isRunning: boolean;
  toogleRunning: () => void;
  timeElapsed: number;
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>;
  lastKnownLocation: Location.LocationObject | null;
  distanceRan: number;
  reportedLocations: { latitude: number; longitude: number }[];
};