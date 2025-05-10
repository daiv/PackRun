import express, { Router } from 'express';

import { checkIfLogged, checkUserBody } from '../controllers/loginController';
import { getAllMessages, postMessage } from '../controllers/chatController';


const messagesRouter: Router = express.Router();

messagesRouter.get('/:userId', checkIfLogged, getAllMessages);

// expected body: {author: string, message: string, time: stringDate}
messagesRouter.post('/:userId', checkIfLogged, checkUserBody, postMessage);


export default messagesRouter;