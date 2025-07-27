import io from 'socket.io-client';
import Location from 'expo-location';
import { parse } from '@babel/core';
import type { FeatureCollection } from 'geojson';

const URL = 'http://192.168.100.18:3000';

export const socket = io(URL, { transports: ['websocket'] });

export async function getRunsFromServer(userId: string): Promise<any[] | null> {
  return await fetchFactory('/tracks/' + userId, 'GET', null);
}

export async function sendMessageToServer(userId: string, message: string) {
  return await fetchFactory('/messages/' + userId, 'POST', { message, author: userId, time: new Date().toISOString() });
}

export async function getMessagesFromServer(userId: string): Promise<{ author: string; time: string; message: string }[] | null> {
  return await fetchFactory('/messages/' + userId, 'GET', null);
}

export async function createTrackOnServer(userId: string): Promise<{ trackId: string | null } | null> {
  return await fetchFactory('/tracks/' + userId, 'PUT', null);
}

export async function postLocationToServerTrack(userId: string, trackId: string, location: Location.LocationObject): Promise<FeatureCollection | null> {
  console.log('location isssss', location);
  console.log('posting tooo', `/tracks/${userId}/${trackId}`);
  return await fetchFactory(`/tracks/${userId}/${trackId}`, 'POST', location);
};

export async function getStadiaApiKey(userId: string): Promise<{ stadiaApiKey: string } | null> {
  console.log('fetching', 'api/stadia/' + userId);
  return await fetchFactory('/api/stadia/' + userId, 'GET', null);
}
export const checkEmail = (email: string) => !email ? 'Email can not be empty' : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) ? 'Invalid email address' : '';

export const checkPassword = (password: string) => {
  if (!password) return 'Password can not be empty';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (! /[0-9]/.test(password)) return 'Password must contain at least one number';
  if (! /[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[^a-zA-Z0-9\s]/.test(password)) return 'Password must contain at least one special character';
  return '';
}

export const avoidFirstRender = (ref: React.MutableRefObject<boolean>, setter: React.Dispatch<React.SetStateAction<string>>, field: string, value: string) => {
  if (ref.current) ref.current = false;
  else {
    switch (field) {
      case 'email':
        setter(checkEmail(value));
        break;
      case 'nick':
        setter(value ? '' : 'Nick can not be empty');
        break;
      case 'password':
        setter(checkPassword(value));
        break;
      default:
        console.warn(`Unknown field: ${field}`);
    }
  }
}

class ApiError extends Error {

  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }

}

export async function fetchFactory<T>(endPoint: string, method: string, body: object | null = null): Promise<T | null> {
  const url = URL + endPoint;
  const initOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  if (body && !['get', 'head'].includes(method.toLowerCase())) initOptions.body = JSON.stringify(body);
  try {
    const response = await fetch(url, initOptions);

    if (response.ok) return response.status === 204 ? null : await response.json();
    else {
      let errorData = null;
      let errorMessage = `Api error: ${response.status} - ${response.statusText}`;
      try {
        errorData = await response.json();
        if (errorData && errorData.message) errorMessage = errorData.message;
        else if (errorData && typeof errorData === 'object') errorMessage = 'Server responded with an error. See details below.';

      } catch (parseError: unknown) {
        console.warn(`WARN: ${method} ${url} 
        - Server returned status ${response.status} 
        but response was not valid JSON. See details below. `);
        const rawErrorText = await response.text().catch(() => null);
        if (rawErrorText) {
          errorMessage = `Raw error text from server: Status: ${response.status} See details below.`;
          console.warn(errorMessage);
        } else errorMessage = `server returned status ${response.status} but response was not valid JSON`;
        errorData = rawErrorText || { parseError: parseError instanceof Error ? parseError.message : String(parseError) };
      }

      console.error(`ERROR FETCH: ${method},  ${url} failed, status= ${response.status}`);
      console.error('Error Details:', errorData || errorMessage);
      throw new ApiError(errorMessage, response.status, errorData);

    }
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Unexpected connection error', 0, error);
  }
}

