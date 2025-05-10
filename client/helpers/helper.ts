import * as Location from 'expo-location';
import { Platform } from 'react-native';

let serverConnection: NodeJS.Timeout | undefined = undefined;
let lastPosition: Object | undefined = undefined;
let positionTracker: NodeJS.Timeout | undefined = undefined;

export async function serverConnect() {
  if (!lastPosition) lastPosition = await getLocation();

  if (lastPosition) {
    console.log('lastPosition', lastPosition);
    const userId = 'userId';
    const body = { ...lastPosition, userId, timestamp: new Date().toISOString() };
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
export function trackPosition(secondsBetweenUpdates: number, setMapRegion: Function) {
  if (positionTracker) {
    clearInterval(positionTracker);
    positionTracker = undefined;
  }
  const track = () => {
    getLocation().then((GpsPosition) => {
      if (GpsPosition) lastPosition = GpsPosition && setMapRegion({
        latitude: GpsPosition.coords.latitude,
        longitude: GpsPosition.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      else console.log('Unable to get position. Permission denied.');
    });

    positionTracker = setInterval(track, secondsBetweenUpdates * 1000);
  }
}

async function getLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return undefined;
  else return await Location.getCurrentPositionAsync();
}

function fetchFactory(endPoint: string, method: string, body: object) {
  const url = 'http://192.168.100.18:3000' + endPoint;
  const response = fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status === 200) return response.json();
      else throw new Error('Network response was not ok.');
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  return response;
}

