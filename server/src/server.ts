import express, { Application } from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import sequelize from './models/model';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router';

const app: Application = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const port = 3000;
const corsOptions = {
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/', router);

io.on('connection', (socket) => {
  console.log('socket stuff coming!!!');
  socket.on('message', msg => {
    console.log(msg);
    io.emit('message', msg);
  });

  // socket preperation for run tracking geoJSON
  socket.on('trackrun', (GeoJSON) => {
    console.log(GeoJSON)
    io.emit('trackrun', GeoJSON)
  })

  // socket preperation for sending light geoJSON to run history upon stopping run tracking
  socket.on('stoprun', (lightGeoJSON) => {
    console.log(lightGeoJSON)
    io.emit('stoprun', lightGeoJSON)
  })


  socket.on('disconnect', () => {
    console.log('socket stuff gone???');
  });
});

(async () => {
  try {
    await sequelize.sync();
    server.listen(port, () => console.log(`Server running at port ${port}!`))
  } catch (error) {
    console.log(error);
  }
})();



