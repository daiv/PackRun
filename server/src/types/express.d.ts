import { Request } from 'express';

import { JwtPayload } from 'aws-jwt-verify/jwt-model';

type userPayload = CognitoIdTokenPayload & {
  email: string;
  sub: string;
};

declare module 'express-serve-static-core' {
  interface Request {
    user: userPayload;
  }
}
