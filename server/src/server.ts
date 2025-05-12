import express, { Application } from 'express';
import { createServer } from 'node:http';
import sequelize from './models/model';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router';
import { createSocketIOServer } from './helpers/IoServer';

const app: Application = express();
const server = createServer(app);
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: 'GET, HEAD, PUT, POST, DELETE',
  credentials: true
}));

app.use(bodyParser.json());
app.use('/', router);
const port = 3000;

createSocketIOServer(server);

(async () => {
  try {
    await sequelize.sync();
    server.listen(port, () => console.log(`Server running at port ${port}!`))
  } catch (error) {
    console.log(error);
  }
})();