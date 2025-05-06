import supertest from 'supertest';
import express from 'express';
import router from './router';


describe('Tests for the server', () => {
  const app = express();

  app.use(express.json());
  app.use('/', router);

  const request = supertest(app);


  it('should respond with a 200 status code for the root endpoint', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  it('should respond with a JSON object for the /api endpoint', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'API is working!' });
  });
});