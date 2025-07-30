import { createContext, useCallback, useContext, useState } from "react";
import { AuthContextType } from "../helpers/Types";
import { AuthTokens, confirmSignUp, fetchAuthSession, getCurrentUser, resendSignUpCode, signIn, signOut, signUp } from "aws-amplify/auth";


const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<AuthTokens | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);


  const createAccount = useCallback(async (email: string, password: string)
    : Promise<{ success: boolean, message: string, error?: Error, errorCode?: number }> => {
    try {
      setIsLoading(true);
      const signUpResponse = await signUp({ username: email, password, options: { userAttributes: { email } } });
      setIsLoading(false);
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
    } finally { setIsLoading(false); }

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
      setIsLoading(true);
      await signIn({ username, password });
      setIsLoading(false);
      const tokensResponse = await fetchAuthSession();
      if (tokensResponse.tokens) {
        setTokens(tokensResponse.tokens);
        setUserId(tokensResponse.tokens.idToken?.payload.sub || username);
        setIsLogged(true);
      } else throw new Error('No tokens received after login');

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
    } finally { setIsLoading(false); }
  }, []);

  const getTokens = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchAuthSession();
      setIsLoading(false);

      if (response.tokens) {

        console.log('tokens received ', response.tokens);
        setTokens(response.tokens);
        setUserId(response.tokens.idToken?.payload.sub || null);
        return response.tokens;
      }
      throw new Error('No tokens received');
    } catch (error: unknown) {
      console.log('Error fetching tokens:', error);
    } finally { setIsLoading(false); }
  }, []);

  const getUser = useCallback(async () => {
    setIsLoading(true);
    const userResponse = await getCurrentUser();
    setIsLoading(false);
    if (userResponse) {
      console.log('Current user:', userResponse);
      return userResponse;
    }
    return null;

  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      const signOutResponse = await signOut();
      setIsLoading(false);

      setTokens(undefined);
      setUserId(null);
      console.log('signoutResponse', signOutResponse);
      return true;
    } catch (error: unknown) {
      console.error('Error during logout:', error);
      return false;
    } finally { setIsLoading(false); }
  }, []);

  const contextValue: AuthContextType = {
    createAccount,
    confirmAccount,
    resendConfirmationCode,
    login,
    logout,
    getTokens,
    getUser,
    tokens,
    userId,
    isLoading,
    isLogged,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}