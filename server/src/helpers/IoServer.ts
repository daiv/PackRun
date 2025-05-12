import { Server as NodeServer } from "node:http";
import { Server } from "socket.io";

export function createSocketIOServer(server: NodeServer) {
  const ioServer = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  ioServer.on('connection', (socket) => {
    console.log('socket connected');

    socket.on('message', msg => {
      console.log('message received', msg);
      ioServer.emit('message', msg);
    });

    // socket preparation for run tracking geoJSON
    socket.on('trackrun', (GeoJSON) => {
      console.log(GeoJSON)
      ioServer.emit('trackrun', GeoJSON)
    })

    // socket preperation for sending light geoJSON to run history upon stopping run tracking
    socket.on('stoprun', (lightGeoJSON) => {
      console.log(lightGeoJSON)
      ioServer.emit('stoprun', lightGeoJSON)
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });
  });
  return ioServer;
}