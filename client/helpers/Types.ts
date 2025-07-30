import { AuthTokens, AuthUser } from 'aws-amplify/auth';
import * as Location from 'expo-location';
import React from 'react';
import { DimensionValue, TextInput, TextInputProps } from 'react-native';

export interface Runner {
  userId: string,
  latitude: number,
  longitude: number
}
export type ConnContextType = {
  lastKnownLocation: Location.LocationObject | null;
  setLastKnownLocation: (arg0: Location.LocationObject) => void;
  setRunningMode: (arg0: boolean) => void;
}
export type BadName = { success: boolean, message: string, error?: Error, errorCode?: number };

export type AuthContextType = {
  userId: string | null;
  createAccount: (email: string, password: string) => Promise<BadName>;
  confirmAccount: (username: string, confirmationCode: string) => Promise<BadName>;
  resendConfirmationCode: (username: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<BadName>;
  logout: () => Promise<boolean>;
  getTokens: () => Promise<AuthTokens | undefined>;
  getUser: () => Promise<AuthUser | null>;
  tokens: AuthTokens | undefined;
  isLogged: boolean;
  isLoading: boolean;
}

export type RunContextType = {
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