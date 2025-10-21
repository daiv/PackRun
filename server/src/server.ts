import express, { Application } from 'express';
import { createServer, Server } from 'node:http';
import sequelize, { createDatabaseIfNotExist } from './models/model';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router';
import { createSocketIOServer } from './helpers/IoServer';
import mockFunctions from './mocks/mockFunctions';
import 'dotenv/config';

export function setupServer() {

  const app: Application = express();
  const server:Server = createServer(app);
  app.use(express.json());

  app.use(cors({
    origin: '*',
    methods: 'GET, HEAD, PUT, POST, DELETE',
    credentials: true
  }));

  app.use(bodyParser.json());
  app.use('/', router);

  const ioServer = createSocketIOServer(server);

  return { app, server, ioServer }
}
export function createAndRunServer() {
  const { server } = setupServer();
  const port = 3000;
  (async () => {
    try {
      await createDatabaseIfNotExist(null);
      await sequelize.sync();
      if (process.env.NODE_ENV === 'demo') mockFunctions.forEach(fun => fun());
      server.listen(port, () => console.log(`Server running at port ${port}!`))
    } catch (error) {
      console.log(error);
    }
  })();
}

if (require.main === module) createAndRunServer();