import * as Location from 'expo-location';

export interface Runner {
  userId: string,
  latitude: number,
  longitude: number
}
export type connContextType = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  lastKnownLocation: Location.LocationObject | null;
  setRunningMode: (arg0: boolean) => void;
  setLocationUpdateCallback: (callback: React.Dispatch<React.SetStateAction<Location.LocationObject | null>>) => void;
}

export type RunContextType = {
  isRunning: boolean;
  toogleRunning: () => void;
  secondsElapsed: number;
  setSecondsElapsed: React.Dispatch<React.SetStateAction<number>>;
  lastKnownLocation: Location.LocationObject | null;
  metersRan: number;
  reportedLocations: { latitude: number; longitude: number }[];
};