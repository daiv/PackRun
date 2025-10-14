import { AuthTokens, AuthUser } from 'aws-amplify/auth';
import * as Location from 'expo-location';
import React from 'react';
import { Socket } from 'socket.io-client';
import { DimensionValue, TextInput, TextInputProps } from 'react-native';

export interface Runner {
  userId: string,
  latitude: number,
  longitude: number
}
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

export type ConnContextType = {
  lastKnownLocation: Location.LocationObject | null;
  socket: Socket | null;
  setLastKnownLocation: (arg0: Location.LocationObject) => void;
  setRunningMode: (arg0: boolean) => void;
  fetchData: <T>(endpoint: string, method: HttpMethod, body?: unknown) => Promise<FetchDataResult<T> | null>;
  isConnected: boolean;
}
export type FetchDataResult<T> =
  | { success: true, data: T | null }
  | { success: false, error: string };

export type AuthResponse = { success: boolean, message: string, error?: Error, errorCode?: number };

export type AuthContextType = {
  userId: string | null;
  nickName: string | null;
  setNickName: React.Dispatch<React.SetStateAction<string | null>>;
  createAccount: (email: string, password: string) => Promise<AuthResponse>;
  confirmAccount: (username: string, confirmationCode: string) => Promise<AuthResponse>;
  resendConfirmationCode: (username: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<boolean>;
  getTokens: () => Promise<AuthTokens | undefined>;
  getUser: () => Promise<AuthUser | null>;
  tokens: AuthTokens | undefined;
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
  nextRef?: React.RefObject<TextInput | null>;
}

type altitudesType = {
  value: number;
}

export type Run = {
  id: string;
  date: string;
  time: string;
  pace: string;
  distance: string;
  profile: altitudesType[];
}

export type RunResponse = {
  trackId: string;
  createdAt: string;
  updatedAt: string;
  estimatedTime: string;
  distance: string;
  altitudes: altitudesType[];
}