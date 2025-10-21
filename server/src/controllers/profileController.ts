import { Response } from 'express';
import ProfileModel from '../models/profileModel';
import { AuthRequest } from '../types/types';
import { changeNickName } from '../helpers/chatFunctions';
import { activeRunners } from './loginController';

export async function getPreferredNick(req: AuthRequest, res: Response) {
  const runner = activeRunners.get(req.user.email);
  if (!runner) return res.status(401).json({ message: 'User not logged in' });
  if (!runner.desiredNickname) return res.status(500).json({ message: 'User is missing desired name' });

  return res.status(200).json({ desiredNickname: runner.desiredNickname });

}

export async function setPreferredNick(req: AuthRequest, res: Response) {
  const { desiredNickname } = req.body;
  if (!desiredNickname) return res.status(400).json({ message: 'Bad request' });

  const runner = activeRunners.get(req.user.email);
  if (!runner) return res.status(401).json({ message: 'User not logged in' });
  const user = await ProfileModel.findOne({ where: { userId: req.user.email } });
  try {
    if (user) {
      await user.update(desiredNickname);
      runner.desiredNickname = desiredNickname;
      changeNickName(runner);
      return res.status(200).json({ message: 'Desired Nickname updated' });
    } else {
      await ProfileModel.create({ userId: req.user.email, desiredNickname });
      runner.desiredNickname = desiredNickname
      changeNickName(runner);
      return res.status(201).json({ message: 'Desired Nickname created' });
    }
  } catch (error) { console.error(error); }
  return res.status(500).json({ message: 'Server error' });
}
