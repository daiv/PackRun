import express, { Router } from 'express';

import { checkIfLogged, logUser } from './controllers/loginController';
import { assignChatRoom, getStadiaApiKey } from './controllers/chatController';

import messagesRouter from './routers/messagesRouter';
import tracksRouter from './routers/tracksRouter';

const router: Router = express.Router();

//logs the user in and returns assigned chatroom and nearbyUsers
router.post('/locations', logUser, assignChatRoom);

router.get('/api/stadia/:userId/', checkIfLogged, getStadiaApiKey);

router.use('/tracks', tracksRouter);
router.use('/messages', messagesRouter);

export default router;