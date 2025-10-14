import express, { Router } from 'express';

import { getAllMessages } from '../controllers/chatController';


const messagesRouter: Router = express.Router();

messagesRouter.get('/', getAllMessages);

export default messagesRouter;