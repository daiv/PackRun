import * as Location from 'expo-location';
import { Platform } from 'react-native';
import io from 'socket.io-client';

export let lastGpsPosition: Location.LocationObject | null = null;
let serverConnection: NodeJS.Timeout | null = null;
let GpsPositionTracker: NodeJS.Timeout | null = null;

let _currentLocation: Location.LocationObject | null = null;
let _locationSubscription: Location.LocationSubscription | null = null;

const URL = 'http://192.168.100.18:3000';

export const USER_ID = 'testUser';
export const socket = io(URL, { transports: ['websocket'] });


export const getLastKnownLocation = () => _currentLocation;


export async function startLocationWatcher(onLocationUpdate: (location: Location.LocationObject) => void): Promise<void> {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permission to access location was denied');
    return;
  }
  _locationSubscription && _locationSubscription.remove();
  _locationSubscription = await Location.watchPositionAsync({
    accuracy: Location.Accuracy.High,
    timeInterval: 1000,
    distanceInterval: 1,
  }, location => {
    _currentLocation = location;
    onLocationUpdate(location);
  });
  console.log('Location watcher started');
}

export function stopLocationWatcher(): void {
  if (_locationSubscription) {
    _locationSubscription.remove();
    _locationSubscription = null;
    _currentLocation = null;
    console.log('Location watcher stopped');
  }
}

export async function serverConnect() {
  if (!lastGpsPosition) {
    let permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    lastGpsPosition = await getLocation();
  }
  const body = lastGpsPosition ? { ...lastGpsPosition, userId: USER_ID, timestamp: new Date().toISOString() } : {};
  const reportPosToServer = () => lastGpsPosition && fetchFactory('/locations', 'POST', body).then(res => console.log('report', res));
  reportPosToServer();
  serverConnection = setInterval(reportPosToServer, 1000 * 60);
}

export function serverDisconnect() {
  console.log('SERVER DISCONNECT');
  if (serverConnection) {
    clearInterval(serverConnection);
    serverConnection = null;
  }
}

export async function getRunsFromServer() {
  return await fetchFactory('/tracks/' + USER_ID, 'GET', null);
}
export async function sendMessageToServer(message: string) {
  return await fetchFactory('/messages/' + USER_ID, 'POST', { message, author: USER_ID, time: new Date().toISOString() });
}
export async function getMessagesFromServer() {
  return await fetchFactory('/messages/' + USER_ID, 'GET', null);
}
async function getLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;
  else return await Location.getCurrentPositionAsync();
}

function fetchFactory(endPoint: string, method: string, body: object | null) {

  const url = URL + endPoint;

  const initOptions: RequestInit = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  if (body) initOptions.body = JSON.stringify(body);

  const response = fetch(url, initOptions)
    .then((response) => {
      if (response.status === 200 || response.status === 201) return response.json();
      else throw new Error('Network response was not ok. ' + response.status);
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  return response;
}

