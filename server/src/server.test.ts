import supertest from 'supertest';
import 'dotenv/config';
import { Application, NextFunction, Request, Response } from 'express';
import sequelize, { createDatabaseIfNotExist, dropDatabaseIfExists } from "./models/model";
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { Socket, Server as SocketIOServer } from 'socket.io';
import io, { Socket as ClientSocket } from 'socket.io-client'
import { AckResponse, SocketIONext } from './types/types';
import { setupServer } from './server'
import TestAgent from 'supertest/lib/agent';
import { Server as HttpServer } from 'node:http';
import { AddressInfo } from 'node:net';



//const mockUser = { user: { email: 'mocked@mock.es', desiredNickname: 'Timotea' }, };
const socketUsers = [
  { user: { email: 'Timotea@mock.es', desiredNickname: 'Timotea' }, },
  { user: { email: 'Stacy@mock.es', desiredNickname: 'Stacy' }, },
];
const TIMOTEA = 0;
const STACY = 1;
let userSelected = TIMOTEA;
jest.mock('./middleware/auth', () => ({
  auth: jest.fn((req: Request, _: Response, next: NextFunction) => {
    req.user = socketUsers[userSelected].user
    next();
  }),
  authSocket: jest.fn((socket: Socket, next: SocketIONext) => {
    // socket.data.user = mockUser.user;
    socket.data.user = socketUsers[userSelected].user;
    next();
  })

}));

const mockLocation = {
  "timestamp": 1748635519011,
  "coords": {
    "accuracy": 100,
    "speed": 0,
    "altitudeAccuracy": 100,
    "heading": 0,
    "latitude": 38.345258778845256,
    "longitude": -0.48129400007124534,
    "altitude": 0
  },
}

describe('Server tests', () => {
  let app: Application, httpServer: HttpServer, ioServer: SocketIOServer;
  let request: TestAgent;
  let clientSocket: ClientSocket[] = [];
  let port: Number;

  beforeAll(async () => {
    const serverSetup = setupServer();
    app = serverSetup.app;
    httpServer = serverSetup.server;
    ioServer = serverSetup.ioServer;
    request = supertest(app);

    await new Promise<void>((resolve, reject) => {
      httpServer.listen(() => {

        const address = httpServer.address();
        if (!address) return reject(new Error('Server addres is null'));

        port = (address as AddressInfo).port;
        resolve();
      });
    });


    for (let client = 0; client < socketUsers.length; client++) {
      userSelected = client;
      await new Promise<void>((resolve, reject) => {
        clientSocket[client] = io(`http://localhost:${port}`, { transports: ['websocket'] });
        clientSocket[client].once('connect', resolve);
        clientSocket[client].once('connect_error', reject);
      })
    }

    const database = (process.env.DB_NAME || "packrundb") + '_test';
    await createDatabaseIfNotExist(database);
    await sequelize.sync();
    for (let client = 0; client < socketUsers.length; client++) {
      userSelected = client;
      await request.post('/locations').send({ ...mockLocation, });
      await request.post('/profile').send({ desiredNickname: socketUsers[client].user.desiredNickname });
    }
    userSelected = TIMOTEA;
  });

  afterAll(async () => {
    ioServer.close();
    // clientSocket.disconnect();
    clientSocket.forEach(client => client.disconnect());
    httpServer.close();
    await sequelize.close();
    dropDatabaseIfExists(process.env.DB_NAME + '_test');
  });

  describe('Locations', () => {

    describe('POST /locations', () => {

      it('should return a chatroom id', async () => {
        const response = await request.post('/locations').send({ ...mockLocation, });
        expect(response.body).toHaveProperty('assignedChatRoom');
        expect(response.status).toBe(200);
        expect(typeof response.body.assignedChatRoom).toBe('string');
      });

      it('should return nearby users', async () => {
        const response = await request.post('/locations').send({ ...mockLocation, });
        expect(response.body).toHaveProperty('nearbyUsers');
        expect(response.status).toBe(200);
        expect(typeof response.body.nearbyUsers).toBe('number');
      });

      it('should return 400 if no coords are provided', async () => {
        const response = await request.post('/locations').send({
          "timestamp": "1743016581565",
        });
        expect(response.status).toBe(400);
      });

      it('should return 400 if no latitude is provided', async () => {
        const response = await request.post('/locations').send({
          "timestamp": "1743016581565",
          "coords": {
            "longitude": -0.48129400007124534
          },
        });
        expect(response.status).toBe(400);
      });

      it('should return 400 if no longitude is provided', async () => {
        const response = await request.post('/locations').send({
          "timestamp": "1743016581565",
          "coords": {
            "latitude": 38.345258778845256,
          },
        });
        expect(response.status).toBe(400);
      });

      it('should return 400 if longitude is incorrect', async () => {
        const response = await request.post('/locations').send({
          "timestamp": "1743016581565",
          "coords": {
            "latitude": 38.345258778845256,
            "longitude": -200
          },
        });
        expect(response.status).toBe(400);
      });

      it('should return 400 if latitude is incorrect', async () => {
        const response = await request.post('/locations').send({
          "timestamp": "1743016581565",
          "coords": {
            "latitude": 200,
            "longitude": -0.48129400007124534
          },
        });
        expect(response.status).toBe(400);
      });

    });

  });
  describe('Profile', () => {

    describe('nickname', () => {
      it('should set and get preferred name', async () => {
        userSelected = TIMOTEA;
        const body = { desiredNickname: socketUsers[userSelected].user.desiredNickname };
        const response = await request.post('/profile').send(body);
        expect([200, 201].includes(response.status)).toBe(true);
        const nick = await request.get('/profile');
        expect(nick.body).toHaveProperty('desiredNickname');
        expect(nick.body.desiredNickname).toBe(socketUsers[userSelected].user.desiredNickname);
      });
    });

  });
  describe('Messages', () => {
    const mockMessage = "this is a mock message.";

    const sender = async (message: string, client: number) => {
      return new Promise<void>((resolve, reject) => {
        clientSocket[client].emit('message', { message }, (response: AckResponse) => {
          if (response.success) resolve();
          else reject(new Error('Something went wrong'));
        });
      });
    };

    describe('GET /messages', () => {
      it('should return 200 return an empty array when no messages', async () => {
        const response = await request.get('/messages/');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
      });
    });

    describe('POST /messages', () => {

      it('should send a message and await server acknowledgement', async () => {
        await sender(mockMessage, TIMOTEA);
      });
    });

    describe('GET /messages', () => {

      it('should return 200 and an array of previously sent messages', async () => {
        const response = await request.get('/messages/');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].message).toBe(mockMessage);
      });
    });

    describe('POST /messages', () => {

      it('should handle malicious messages', async () => {
        const maliciousMessage = "'); DROP TABLE chatroom; --";
        await sender(maliciousMessage, TIMOTEA);
        const response = await request.get('/messages/');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
      });
    });
    describe('Message integrity', () => {
      it('should identify sender', async () => {
        const response = await request.get('/messages/');
        expect(response.body[0].author).toBe(socketUsers[userSelected].user.desiredNickname);
      });
      it('should show Date', async () => {
        const response = await request.get('/messages/');
        
      })

    });
  });

  describe('Tracks', () => {

    let trackId = '';

    describe('PUT /tracks', () => {
      it('should return 201 and the trackId', async () => {
        const response = await request.put('/tracks/');
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('trackId');
        expect(response.body.trackId).not.toBeNaN();
        trackId = response.body.trackId;
      });
    });

    describe('GET /tracks', () => {
      it('should return 200 and an array when there is tracks', async () => {
        const response = await request.get('/tracks/');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
      });
    });

    describe('POST /tracks', () => {
      it('should return 204 if not enough waypoints', async () => {
        const response = await request.post('/tracks/' + '/' + trackId).send(mockLocation);
        expect(response.status).toBe(204);
      });

      it('should return 400 if no coords are provided', async () => {
        const response = await request.post('/tracks/' + '/' + trackId).send({});
        expect(response.status).toBe(400);
      });

      it('should return 200 and the waypoints', async () => {
        const result = await request.post('/tracks/' + '/' + trackId).send(mockLocation);
        expect(result.status).toBe(200);
      });
    });

    describe('DELETE /tracks', () => {
      it('should return 200 and delete the track', async () => {
        const response = await request.delete('/tracks/' + '/' + trackId);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Track deleted');
      });
    });

    describe('GET /tracks', () => {
      it('should return 200 and an empty array when no tracks', async () => {
        const response = await request.get('/tracks/');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
      });
    });
  });
});
