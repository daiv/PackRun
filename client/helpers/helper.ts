import io from 'socket.io-client';

const URL = 'http://192.168.100.18:3000';

export const USER_ID = 'testUser';
export const socket = io(URL, { transports: ['websocket'] });

export async function getRunsFromServer() {
  return await fetchFactory('/tracks/' + USER_ID, 'GET', null);
}
export async function sendMessageToServer(message: string) {
  return await fetchFactory('/messages/' + USER_ID, 'POST', { message, author: USER_ID, time: new Date().toISOString() });
}
export async function getMessagesFromServer() {
  return await fetchFactory('/messages/' + USER_ID, 'GET', null);
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

