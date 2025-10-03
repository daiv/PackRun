
import express, { Router } from 'express';
import { getPreferredNick, setPreferredNick } from '../controllers/profileController';

const profileRouter: Router = express.Router();

profileRouter.get('/', getPreferredNick);
profileRouter.post('/', setPreferredNick);

export default profileRouter;