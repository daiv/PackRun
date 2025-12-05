import { useRef, useState } from "react";
import { checkEmail, checkMatchingPasswords, checkNick, checkPassword } from "../helpers/helper";
import { useValidatedState } from "./useValidatedState";
import { useAuthContext, useConnContext } from "@context";
import { Alert, TextInput } from "react-native";

export function useCreateAccount() {


  const { value: email, setValue: setEmail, error: emailError, validate: validateEmail } = useValidatedState<string>('', checkEmail);
  const { value: nick, setValue: setNick, error: nickError, validate: validateNick } = useValidatedState<string>('', checkNick);
  const { value: password, setValue: setPassword, error: pwError, validate: validatePwd } = useValidatedState<string>('', checkPassword);
  const { value: matchingPwd, setValue: setMatchingPwd, error: matchingPwdError, validate: validateMatchingPwd } = useValidatedState<string>('', checkMatchingPasswords(password));
  const [confirmationCode, setConfirmationCode] = useState('');

  const [isModalVisible, setModalVisible] = useState(false);

  const { createAccount, confirmAccount, resendConfirmationCode, login, getTokens, isLoading } = useAuthContext();
  const { fetchData } = useConnContext();

  const emailRef = useRef<TextInput>(null);
  const nickRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const matchPassRef = useRef<TextInput>(null);

  function handleCancelModal() {
    setModalVisible(false);
    setConfirmationCode('');
  }

  async function handleAccountCreation() {
    const currentEmailError = validateEmail();
    const currentNickError = validateNick();
    const currentPwdError = validatePwd();
    const currentMatchingPwdError = validateMatchingPwd();

    if (currentEmailError || currentNickError || currentPwdError || currentMatchingPwdError) {
      console.warn('There are errors in the form, please fix them before proceeding.');
      return;
    } else {
      const responseAccCreation = await createAccount(email, password);
      if (responseAccCreation.success) {
        setModalVisible(true);
      } else {
        const alertTitle = 'Account creation failed';
        switch (responseAccCreation.errorCode) {
          case 1: // UsernameExistsException
            Alert.alert(alertTitle, responseAccCreation.message + '\nDo you have a confirmation code?',
              [
                { text: 'No', onPress: () => { } },
                { text: 'Yes', onPress: () => setModalVisible(true) }
              ]);
            break;
          default:
            console.error('An error occurred while creating the account:', responseAccCreation.error);
            break;
        }
      }
    }
  }

  async function handleAccountConfirmation() {
    console.log('confirming first');
    const responseConfirmation = await confirmAccount(email, confirmationCode);
    if (responseConfirmation.success) {
      setModalVisible(false);
      const loginResponse = await login(email, password);
      if (loginResponse.success) {
        const tokens = await getTokens();
        if (tokens) {
          const response = await fetchData('/profile', 'POST', { desiredNickname: nick });
          if (response?.success) {
            console.warn('Nickname set on server successfully');
          } else {
            console.warn('Could not set nickname on server', response?.error);
          }
        }
      }
      console.warn('Account confirmed successfully:', responseConfirmation.message);

    } else {
      const alertTitle = 'Account confirmation failed';
      switch (responseConfirmation.errorCode) {
        case 1: // ExpiredCodeException
          Alert.alert(alertTitle, responseConfirmation.message + "\n Do you want a new one?",
            [
              { text: 'No', onPress: () => { } },
              {
                text: 'Yes', onPress: async () => {
                  const resendSuccess = await resendConfirmationCode(email);
                  if (resendSuccess) {
                    Alert.alert('New confirmation code sent to your email.');
                  } else {
                    Alert.alert('Failed to resend confirmation code. Please try again later.');
                  }
                }
              }
            ]);
          break;
        case 2: // LimitExceededException
          Alert.alert(alertTitle, responseConfirmation.message);
          break;
        case 3: // CodeMismatchException
          Alert.alert(alertTitle, responseConfirmation.message);
          break;
        default:
          console.error('An error occurred while confirming the account:', responseConfirmation.error);
          break;
      }
    }
    console.warn('Account confirmation response:', responseConfirmation);
  }
  return {
    email,
    setEmail,
    emailError,
    nick,
    setNick,
    nickError,
    password,
    setPassword,
    pwError,
    matchingPwd,
    setMatchingPwd,
    matchingPwdError,
    confirmationCode,
    setConfirmationCode,
    isModalVisible,
    setModalVisible,
    isLoading,
    handleCancelModal,
    handleAccountCreation,
    handleAccountConfirmation,
    emailRef,
    nickRef,
    passRef,
    matchPassRef,
  };
}