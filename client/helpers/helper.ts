import * as Location from 'expo-location';
import { Platform } from 'react-native';
import io from 'socket.io-client';

let serverConnection: NodeJS.Timeout | undefined = undefined;
let lastGpsPosition: Object | undefined = undefined;
let GpsPositionTracker: NodeJS.Timeout | undefined = undefined;

const URL = 'http://192.168.100.18:3000';

export const USER_ID = 'testUser';
export const socket = io(URL, { transports: ['websocket'] });

export async function serverConnect() {
  if (!lastGpsPosition) lastGpsPosition = await getLocation();

  if (lastGpsPosition) {
    console.log('lastPosition', lastGpsPosition);

    const body = { ...lastGpsPosition, userId: USER_ID, timestamp: new Date().toISOString() };
    fetchFactory('/locations', 'POST', body).then(response => console.log('response', response));
    serverConnection = setInterval(() => fetchFactory('/locations', 'POST', body), 1000 * 60);
  } else console.log('Unable to get position. No positions available.');
}

export function serverDisconnect() {
  if (serverConnection) {
    clearInterval(serverConnection);
    serverConnection = undefined;
  }
}
export function trackGpsPosition(secondsBetweenUpdates: number, setMapRegion: Function) {
  if (GpsPositionTracker) {
    clearInterval(GpsPositionTracker);
    GpsPositionTracker = undefined;
  }
  const track = () => {
    getLocation().then((GpsPosition) => {
      if (GpsPosition) lastGpsPosition = GpsPosition && setMapRegion({
        latitude: GpsPosition.coords.latitude,
        longitude: GpsPosition.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      else console.log('Unable to get position. Permission denied.');
    });
  }
  track();
  GpsPositionTracker = setInterval(track, secondsBetweenUpdates * 1000);

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
  if (status !== 'granted') return undefined;
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

