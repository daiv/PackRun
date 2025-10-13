import { Message } from "@common";
import { Server as NodeServer } from "node:http";
import { Server } from "socket.io";
import { AuthSocketData, ClientToServerEvents, InterServerEvents, ServerToClientEvents } from "../types/types";
import { verifyToken } from "./authFunctions";
import { activeRunners } from "../controllers/loginController";
import { saveMessage } from "../controllers/chatController";

export function createSocketIOServer(server: NodeServer) {
  const ioServer = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    AuthSocketData
  >
    (server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
  ioServer.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const payload = await verifyToken(token);
      if (payload) {
        socket.data.user = payload;
        socket.data.user.email = payload.email;
        next();
      }

    } catch (error) {
      console.error('error', error);
    }
  });

  ioServer.on('connection', (socket) => {

    console.log('socket connected', socket.data.user.email || 'no email');

    socket.on('message', async msg => {
      console.log('message received', msg);
      if (msg.message.trim()) {
        const sender = activeRunners.get(socket.data.user.email);
        const message: Message = {
          author: sender?.currentNickname || '',
          message: msg.message,
          time: new Date()
        }
        if (message.author && sender?.assignedChatRoom) {
          if (await saveMessage(message, sender.assignedChatRoom)) socket.emit('message', message);
        } else console.error('error', 'no author');
      } else console.error('error', 'message is empty');
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });
  });
  return ioServer;
}