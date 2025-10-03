import express, { Router } from 'express';

import { checkIfLoggedIn, logUser } from './controllers/loginController';
import { assignChatRoom, getStadiaApiKey } from './controllers/chatController';

import messagesRouter from './routers/messagesRouter';
import tracksRouter from './routers/tracksRouter';
import auth from './middleware/auth';
import profileRouter from './routers/profileRouter';

const router: Router = express.Router();

router.use(auth);
//logs the user in and returns assigned chatroom and nearbyUsers

router.post('/locations', logUser, assignChatRoom);

router.use(checkIfLoggedIn);

router.get('/api/stadia/', getStadiaApiKey);

router.use('/tracks', tracksRouter);
router.use('/messages', messagesRouter);

router.use('/profile', profileRouter);

export default router;