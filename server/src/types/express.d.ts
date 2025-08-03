import { Request } from 'express';

import { JwtPayload } from 'aws-jwt-verify/jwt-model';

type userPayload = CognitoIdTokenPayload & {
  email: string;
  sub: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: userPayload;
    }
  }
}
