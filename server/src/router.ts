import express, { Router } from 'express';

import { checkIfLogged, logUser } from './controllers/loginController';
import { assignChatRoom, getStadiaApiKey } from './controllers/chatController';

import messagesRouter from './routers/messagesRouter';
import tracksRouter from './routers/tracksRouter';
import auth from './middleware/auth';

const router: Router = express.Router();

//logs the user in and returns assigned chatroom and nearbyUsers
router.post('/locations', auth, logUser, assignChatRoom);

router.get('/api/stadia/:userId/', auth, /* checkIfLogged, */ getStadiaApiKey);

router.use('/tracks', auth, tracksRouter);
router.use('/messages', auth, messagesRouter);

export default router;