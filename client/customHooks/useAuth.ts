import { AuthTokens, confirmSignUp, fetchAuthSession, getCurrentUser, resendSignUpCode, signIn, signOut, signUp } from "aws-amplify/auth";
import { useCallback, useState } from "react";

export function useAuth() {

  const [tokens, setTokens] = useState<AuthTokens | undefined>(undefined);

  const createAccount = useCallback(async (email: string, password: string)
    : Promise<{ success: boolean, message: string, error?: Error, errorCode?: number }> => {
    try {
      console.log('hola');
      const signUpResponse = await signUp({ username: email, password, options: { userAttributes: { email } } });
      console.warn('Account created successfully:', signUpResponse);

      return { success: true, message: 'Account created successfully. Please check your email for the confirmation code.' };

    } catch (error: unknown) {

      if (error instanceof Error) {
        console.error('Error creating account:', error.message);
        console.error('Error details:', error);
        const errorInfo = { success: false, error, message: '', errorCode: 0 };
        switch (error.name) {
          case 'UsernameExistsException':
            errorInfo.message = 'Cannot create account, if you already have an account, please login instead.';
            errorInfo.errorCode = 1;
            break;
        }
        return errorInfo;
      }

      return { success: false, message: 'An unknown error occurred while creating the account.', errorCode: 0 };
    }

  }, []);

  const confirmAccount = useCallback(async (username: string, confirmationCode: string)
    : Promise<{ success: boolean, message: string, error?: Error, errorCode?: number }> => {
    try {
      console.log('confirming');
      const confirmResponse = await confirmSignUp({ username, confirmationCode });

      if (confirmResponse.isSignUpComplete) {
        console.log('Account confirmed successfully:', confirmResponse);
        return { success: true, message: 'Account confirmed successfully.' };
      } else throw new Error('Account confirmation failed.');

    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorInfo = { success: false, message: error.message, errorCode: 0 };
        switch (error.name) {
          case 'ExpiredCodeException':
            console.log('confirmSignUp error', error);
            errorInfo.errorCode = 1;
            break;

          case 'LimitExceededException':
            errorInfo.errorCode = 2;
            break;
          case 'CodeMismatchException':
            errorInfo.errorCode = 3;
            break;
        }

        console.error('Error confirming account:', error.message);
        console.error('Error details:', error);

        return errorInfo;
      }
      return { success: false, message: 'An unknown error occurred while confirming the account.', errorCode: 0 };
    }
  }, []);

  const resendConfirmationCode = useCallback(async (username: string) => {
    try {
      const response = await resendSignUpCode({ username });
      return true;
    } catch (error: unknown) {
      return false;
    }
  }, []);

  const login = useCallback(async (username: string, password: string)
    : Promise<{ success: boolean, message: string, error?: Error, errorCode?: number }> => {

    try {
      const response = await signIn({ username, password });
      return { success: true, message: 'Login successful' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorInfo = { success: false, message: error.message, errorCode: 0 };
        switch (error.name) {
          case 'UserAlreadyAuthenticatedException':
            errorInfo.errorCode = 1;
            break;
          case 'NotAuthorizedException':
            errorInfo.errorCode = 2;
            break;
        }
        console.error('Error logging in:', error);
        return errorInfo;
      }
      return { success: false, message: 'An unknown error occurred while logging in.', errorCode: 0 };
    }
  }, []);

  const getTokens = useCallback(async () => {
    try {
      const response = await fetchAuthSession();

      if (response.tokens) {
        console.log(response.tokens)
        setTokens(response.tokens);
        return response.tokens;
      }
      return null;
    } catch (error: unknown) {
      return null;
    }
  }, []);

  const getUser = useCallback(async () => {
    const userResponse = await getCurrentUser();
    if (userResponse) {
      console.log('Current user:', userResponse);
      return userResponse;
    }
    return null;

  }, []);

  const logout = useCallback(async () => {
    try {
      const signOutResponse = await signOut();
      setTokens(undefined);
      console.log('signoutResponse', signOutResponse);
    } catch (error: unknown) {
      console.error('Error during logout:', error);
      return { success: false, message: 'Logout failed', error };
    }
  }, []);
  return { createAccount, confirmAccount, resendConfirmationCode, login, getTokens, tokens, getUser, logout }
}