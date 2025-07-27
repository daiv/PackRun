import { AuthTokens } from 'aws-amplify/auth';
import * as Location from 'expo-location';
import React from 'react';
import { DimensionValue, TextInput, TextInputProps } from 'react-native';

export interface Runner {
  userId: string,
  latitude: number,
  longitude: number
}
export type ConnContextType = {
  updateCredentials: (tokens: AuthTokens | undefined, userEmail: string) => void;
  userId: string;
  lastKnownLocation: Location.LocationObject | null;
  setLastKnownLocation: (arg0: Location.LocationObject) => void;
  setRunningMode: (arg0: boolean) => void;
}

export type RunContextType = {
  userId: string;
  updateCredentials: (tokens: AuthTokens | undefined, userEmail: string) => void;
  isRunning: boolean;
  toogleRunning: () => void;
  secondsElapsed: number;
  setSecondsElapsed: React.Dispatch<React.SetStateAction<number>>;
  lastKnownLocation: Location.LocationObject | null;
  metersRan: number;
  route: GeoJSON.FeatureCollection | undefined | null;
};

export type AuthProps = {
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;

}

export interface RunProviderProps {
  children: React.ReactNode;
}

export type RunButtonStyleProps = {
  bottom?: DimensionValue | undefined;
  top?: DimensionValue | undefined;
  left?: DimensionValue | undefined;
  right?: DimensionValue | undefined;
}
export interface SmartInputProps extends TextInputProps {
  errorMessage?: string;
  nextRef?: React.RefObject<TextInput>;
}