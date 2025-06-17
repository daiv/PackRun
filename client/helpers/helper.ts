import io from 'socket.io-client';
import Location from 'expo-location';

const URL = 'http://192.168.100.18:3000';

let userId = '';

export const socket = io(URL, { transports: ['websocket'] });

export function setHelperUserId(id: string) {
  userId = id;
}
export async function getRunsFromServer() {
  return await fetchFactory('/tracks/' + userId, 'GET', null);
}

export async function sendMessageToServer(message: string) {
  return await fetchFactory('/messages/' + userId, 'POST', { message, author: userId, time: new Date().toISOString() });
}

export async function getMessagesFromServer() {
  return await fetchFactory('/messages/' + userId, 'GET', null);
}

export async function createTrackOnServer() {
  return await fetchFactory('/tracks/' + userId, 'PUT', null);
}

export async function postLocationToServerTrack(trackId: string, location: Location.LocationObject) {
  console.log('location isssss', location);
  console.log('posting tooo', `/tracks/${userId}/${trackId}`);
  return await fetchFactory(`/tracks/${userId}/${trackId}`, 'POST', location);
};
export async function getStadiaApiKey() {
  console.log('fetching', 'api/stadia/' + userId);
  return await fetchFactory('/api/stadia/' + userId, 'GET', null);
}

export async function createAccount(user: string, password: string) {

}

export function fetchFactory(endPoint: string, method: string, body: object | null) {

  const url = URL + endPoint;

  const initOptions: RequestInit = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  if (method.toLowerCase() !== 'get' && method.toLowerCase() !== 'head' && body) initOptions.body = JSON.stringify(body);

  return fetch(url, initOptions)
    .then(response => {
      if (response.ok) return response.status === 204 ? null : response.json();
      else {
        console.error('ERROR');
        console.log(response.status);
        response.json().then(console.error)

        throw new Error('Network response was not ok. ' + response.status);
      }
    })
    .catch(error => {
      console.error('SERVER ERROR RESPONSE', error);
      console.error('There has been a problem with your fetch operation:', error);
      throw new Error('Fetch operation failed: ' + error.message);
    });
}

