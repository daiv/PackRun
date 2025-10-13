import { CognitoJwtVerifier } from "aws-jwt-verify";

const userPoolId = process.env.COGNITO_USER_POOL_ID || '';
const clientId = process.env.COGNITO_CLIENT_ID || '';

const verifier = CognitoJwtVerifier.create({
  userPoolId,
  tokenUse: 'id',
  clientId,
});

export async function verifyToken(token: string) {

  try {
    const payload = await verifier.verify(token);
    return payload;
  } catch (error) {
    console.warn('Error verifying token', error);
    throw Error('Error verifying token');
  }

}