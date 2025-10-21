import { Message } from "@common";
import { Server as NodeServer } from "node:http";
import { Server } from "socket.io";
import { AuthSocketData, ClientToServerEvents, InterServerEvents, ServerToClientEvents } from "../types/types";
import { activeRunners } from "../controllers/loginController";
import { saveMessage } from "../controllers/chatController";
import { authSocket } from "../middleware/auth";

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

  ioServer.use(authSocket);

  ioServer.on('connection', (socket) => {

    console.log('socket connected', socket.data.user.email || 'no email');

    socket.on('message', async (msg, callback) => {
      console.log('message received', msg);
      if (!msg.message.trim()) callback && callback({ success: false, message: 'empty message' }) && console.error('error', 'message is empty');

      const sender = activeRunners.get(socket.data.user.email);
      if (!sender) return callback && callback({ success: false, message: 'user is not logged in' }) && console.log();

      if (!sender?.assignedChatRoom) return callback && callback({ success: false, message: 'no chatrrom' }) && console.error('error', 'no chatrrom');

      if (!sender.currentNickname) return callback && callback({ success: false, message: 'user has no nickname assigned' });

      const message: Message = {
        author: sender.currentNickname,
        message: msg.message,
        time: new Date()
      }
      if (await saveMessage(message, sender.assignedChatRoom)) {
        socket.emit('message', message);
        return callback && callback({ success: true, message });
      } else return callback && callback({ success: false, message: 'db save failed' });

    });

    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });
  });

  return ioServer;
}