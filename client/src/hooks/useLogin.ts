import { useAuthContext } from "@context";
import { useValidatedState } from "./useValidatedState";
import { useEffect } from "react";
import { checkEmail } from "../helpers/helper";

export function useLogin() {
  const { value: email, setValue: setEmail, error: emailError, validate: validateEmail } = useValidatedState<string>('', checkEmail);
  const { value: password, setValue: setPassword, error: passwordError, validate: validatePassword } = useValidatedState<string>('', password => password ? '' : 'Password cannot be empty');

  const { login, getTokens, isLoading } = useAuthContext();

  useEffect(() => { getTokens() }, []);

  const handleLogin = async () => {
    const currentEmailError = validateEmail();
    const currentPasswordError = validatePassword();

    if (currentEmailError || currentPasswordError) {
      console.warn('There are errors in the form, please fix them before proceeding.');
      return false;
    }
    const loginResponse = await login(email, password);
    if (loginResponse.success) {
      return true;
    } else {
      switch (loginResponse.errorCode) {
        case 1:
          console.warn('User already authenticated');
          break;
        case 2:
          console.warn('Invalid credentials');
          break;
        default:
          console.warn('An unknown error occurred while logging in.');
      }
      return false;
    }
  }

  return {
    email,
    setEmail,
    emailError,
    password,
    setPassword,
    passwordError,
    handleLogin,
    isLoading
  };
}