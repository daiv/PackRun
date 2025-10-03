import { Response } from 'express';
import ProfileModel from '../models/profileModel';
import { AuthRequest } from '../types/types';

export async function getPreferredNick(req: AuthRequest, res: Response) {

  const { desiredNickname } = await getDBPreferredNick(req.user.email);
  if (desiredNickname) res.status(200).json({ desiredNickname });
  else res.status(500).json({ message: 'Server error' });

}
export async function getDBPreferredNick(userId: string): Promise<{ desiredNickname: string }> {
  return await ProfileModel.findOne({ where: { userId } }) || { desiredNickname: 'packRunner' };
}
export function setPreferredNick(req: AuthRequest, res: Response) {
  const { desiredNickname } = req.body;
  if (!desiredNickname) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  ProfileModel.findOne({ where: { userId: req.user.email } })
    .then((user) => {
      if (user) {
        user.desiredNickname = desiredNickname;
        user.save()
          .then(() => res.status(200).json({ message: 'Nickname updated' }))
          .catch(() => res.status(500).json({ message: 'Server error' }));
      } else {
        ProfileModel.create({ userId: req.user.email, desiredNickname })
          .then(() => res.status(201).json({ message: 'Nickname created' }))
          .catch(() => res.status(500).json({ message: 'Server error' }));
      }
    })
    .catch(() => res.status(500).json({ message: 'Server error' }));
}