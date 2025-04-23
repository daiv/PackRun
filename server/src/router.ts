import express, { Router } from 'express';

import { logUser } from './controllers/loginController';
import { assignChatRoom } from './controllers/chatController';

import messagesRouter from './routers/messagesRouter';
import tracksRouter from './routers/tracksRouter';

const router: Router = express.Router();

//logs the user in and returns a userId
router.post('/locations', logUser, assignChatRoom);

router.use('/tracks', tracksRouter);
router.use('/messages', messagesRouter);

export default router;