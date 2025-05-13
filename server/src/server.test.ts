import supertest from 'supertest';
import express from 'express';
import router from './router';
import sequelize, { createDatabaseIfNotExist, dropDatabaseIfExists } from "./models/model";
import 'dotenv/config';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

describe('Endpoints test', () => {
  const app = express();
  console.log('env', process.env.NODE_ENV);
  app.use(express.json());
  app.use('/', router);

  const request = supertest(app);


  beforeAll(async () => {
    const database = (process.env.DB_NAME || "packrundb") + '_test';
    await createDatabaseIfNotExist(database);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
    dropDatabaseIfExists(process.env.DB_NAME + '_test');
  });

  const userId = 'testUser';
  const mockLocation = {
    "timestamp": "1743016581565",
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

  describe('Locations', () => {

    describe('POST /locations', () => {

      it('should return a chatroom id', async () => {
        const response = await request.post('/locations').send({ ...mockLocation, userId });
        expect(response.body).toHaveProperty('assignedChatRoom');
        expect(response.status).toBe(200);
        expect(typeof response.body.assignedChatRoom).toBe('string');
      });

      it('should return nearby users', async () => {
        const response = await request.post('/locations').send({ ...mockLocation, userId });
        expect(response.body).toHaveProperty('nearbyUsers');
        expect(response.status).toBe(200);
        expect(typeof response.body.nearbyUsers).toBe('number');
      });

      it('should return 400 if no userId is provided', async () => {
        const response = await request.post('/locations').send({
          "timestamp": "1743016581565",
          "coords": {
            "latitude": 38.345258778845256,
            "longitude": -0.48129400007124534
          }
        });
        expect(response.status).toBe(400);
      });

      it('should return 400 if no coords are provided', async () => {
        const response = await request.post('/locations').send({
          "timestamp": "1743016581565",
          userId
        });
        expect(response.status).toBe(400);
      });

      it('should return 400 if no latitude is provided', async () => {
        const response = await request.post('/locations').send({
          "timestamp": "1743016581565",
          "coords": {
            "longitude": -0.48129400007124534
          },
          userId
        });
        expect(response.status).toBe(400);
      });

      it('should return 400 if no longitude is provided', async () => {
        const response = await request.post('/locations').send({
          "timestamp": "1743016581565",
          "coords": {
            "latitude": 38.345258778845256,
          },
          userId
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
          userId
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
          userId
        });
        expect(response.status).toBe(400);
      });

    });
  });

  describe('Messages', () => {

    describe('GET /messages', () => {
      it('should return 200 return an emtpy array when no messages', async () => {
        const response = await request.get('/messages/' + userId);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
      });
    });

    describe('POST /messages', () => {
      const mockMessage = {
        "author": "David",
        "message": "hello",
        "time": "09/01/2023 12:00:00"
      }

      it('should return 400 if no author is provided', async () => {
        const response = await request.post('/messages/' + userId).send({
          "message": "hello",
          "time": "now"
        });
        expect(response.status).toBe(400);
      });

      it('should return 400 if no message is provided', async () => {
        const response = await request.post('/messages/' + userId).send({
          "author": "David",
          "time": "now"
        });
        expect(response.status).toBe(400);
      });

      it('should return 400 if no time is provided', async () => {
        const response = await request.post('/messages/' + userId).send({
          "author": "David",
          "message": "hello"
        });
        expect(response.status).toBe(400);
      });

      it('should return 400 if time is not a date formatted string', async () => {
        const response = await request.post('/messages/' + userId).send({
          "author": "David",
          "message": "hello",
          "time": 123456789
        });
        expect(response.status).toBe(400);
      });

      it('should return 201 and the message', async () => {
        const response = await request.post('/messages/' + userId).send(mockMessage);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success');

      });
    });

    describe('GET /messages', () => {
      it('should return 200 and an array of messages', async () => {
        const response = await request.get('/messages/' + userId);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
      });
    });
  });

  describe('Tracks', () => {

    let trackId = '';

    describe('PUT /tracks', () => {
      it('should return 201 and the trackId', async () => {
        const response = await request.put('/tracks/' + userId);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('trackId');
        expect(response.body.trackId).not.toBeNaN();
        trackId = response.body.trackId;
      });
    });

    describe('GET /tracks', () => {
      it('should return 200 and an array when there is tracks', async () => {
        const response = await request.get('/tracks/' + userId);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
      });
    });

    describe('POST /tracks', () => {
      it('should return 204 if not enough waypoints', async () => {
        const response = await request.post('/tracks/' + userId + '/' + trackId).send(mockLocation);
        expect(response.status).toBe(204);
      });

      it('should return 400 if no coords are provided', async () => {
        const response = await request.post('/tracks/' + userId + '/' + trackId).send({});
        expect(response.status).toBe(400);
      });

      it('should return 200 and the waypoints', async () => {
        const result = await request.options('/tracks/' + userId + '/' + trackId).send(mockLocation);
        expect(result.status).toBe(200);
      });
    });

    describe('DELETE /tracks', () => {
      it('should return 200 and delete the track', async () => {
        const response = await request.delete('/tracks/' + userId + '/' + trackId);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Track deleted');
      });
    });

    describe('GET /tracks', () => {
      it('should return 200 and an empty array when no tracks', async () => {
        const response = await request.get('/tracks/' + userId);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
      });
    });
  });
});