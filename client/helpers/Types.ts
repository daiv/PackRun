import * as Location from 'expo-location';

export interface Runner {
  userId: string,
  latitude: number,
  longitude: number
}
export type ConnContextType = {
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
  route: GeoJSON.FeatureCollection | undefined;
};

export type LoginProps = {
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface RunProviderProps {
  children: React.ReactNode;
}