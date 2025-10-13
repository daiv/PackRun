import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helpers/authFunctions';

export default async function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    const payload = await verifyToken(token);
    if (payload) {
      req.user = payload;
      req.user.email = payload.email;

    }
    if (!req.user.email) return res.status(401).json({ message: 'Email not found in token' });

  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
  next();
}