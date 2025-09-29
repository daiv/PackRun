import express, { Router } from 'express';

import { checkUserBody } from '../controllers/loginController';
import { getAllMessages, postMessage } from '../controllers/chatController';


const messagesRouter: Router = express.Router();

messagesRouter.get('/', getAllMessages);

messagesRouter.post('/', checkUserBody, postMessage);


export default messagesRouter;