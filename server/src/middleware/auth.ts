import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { Request, Response, NextFunction } from 'express';

const userPoolId = process.env.USERPOOLID || '';
const clientId = process.env.CLIENTID || '';

const verifier = CognitoJwtVerifier.create({
  userPoolId,
  tokenUse: 'id',
  clientId,
});

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
    const payload = await verifier.verify(token);
    req.user = payload;
    req.user.email = payload.email;
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
  next();
}