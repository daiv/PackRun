import { TextInput, View, Text, TouchableOpacity, Alert, ActivityIndicator, Modal } from "react-native";
import { useConnContext } from "../../context/ConnContext";
import { useState, useRef, useEffect, SetStateAction } from "react";
import { styles } from './styles'
import { AuthProps } from "../../helpers/Types";
import { setHelperUserId } from "../../helpers/helper";
import { signUp, confirmSignUp, resendSignUpCode, signIn, resetPassword, confirmResetPassword, fetchAuthSession, AuthSession, AuthTokens } from 'aws-amplify/auth';
import SmartInput from "../../components/SmartInput";
import CreateAccount from "../../components/CreateAccount";

export default function Login({ setIsLogged }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nick, setNick] = useState('');
  const [loginMode, setLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmingAccount, setIsConfirmingAccount] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nickError, setNickError] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [tokens, setTokens] = useState<AuthTokens | undefined>(undefined);
  const { setUserId } = useConnContext();

  const emailRef = useRef<TextInput>(null);
  const nickRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

  useEffect(function getSession() {
    fetchAuthSession().then(session => {

      if (session.tokens) {
        const { tokens } = session;

      }
      setTokens(session.tokens)


    });
  }, []);

  function areAllFieldsOk() {
    const emailErrorMessage = checkEmail();
    const passwordErrorMessage = checkPassword();
    const nickErrorMessage = (loginMode || nick ? '' : 'Nick can not be empty');

    setEmailError(emailErrorMessage)
    setPasswordError(passwordErrorMessage);
    setNickError(nickErrorMessage);

    return email && !emailErrorMessage && password && !passwordErrorMessage && (loginMode || nick && !nickErrorMessage);
  }

  const checkEmail = () => !email ? 'Email can not be empty' : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) ? 'Invalid email address' : '';

  const checkPassword = () => {
    if (!password) return 'Password can not be empty';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (! /[0-9]/.test(password)) return 'Password must contain at least one number';
    if (! /[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[^a-zA-Z0-9\s]/.test(password)) return 'Password must contain at least one special character';
    return '';
  }

  const mockRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      setUserId('USER_ID');
      setHelperUserId('USER_ID');
      setIsLogged(true);
    }
      , 1000);
  }

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setNick('');
  }

  const resetErrors = () => {
    setEmailError('');
    setPasswordError('');
    setNickError('');
  }

  async function handleLogin() {
    if (!loginMode) {
      setLoginMode(true);
      resetErrors();
    }
    else {
      if (areAllFieldsOk()) {
        setIsLoading(true);
        try {

          const signInResponse = await signIn({ username: email, password });
          console.log('signIn response', signInResponse);
          if (signInResponse.isSignedIn) {
            getTokens();

          }
        } catch (error: unknown) {
          console.log('signIn error', error);
          if (error instanceof Error) {
            console.log('name', error.name);
            console.log('message', error.message);
            switch (error.name) {
              case 'UserAlreadyAuthenticatedException':
                getTokens();
                break;
            }
          }
        }
      }
    }
  }

  async function getTokens() {
    const { tokens } = await fetchAuthSession();
    console.log('tokens', tokens);
    setIsLoading(false);
  }

  function handleCancelModal() {
    setModalVisible(false);
    setConfirmationCode('');
  }

  async function handleAccountCreation() {
    if (loginMode) {
      setLoginMode(false);
      setIsConfirmingAccount(false);
      resetErrors();
    }
    else if (areAllFieldsOk()) {
      if (isConfirmingAccount) {
        setModalVisible(true);
      } else {
        setIsLoading(true);
        try {
          const response = await signUp({ username: email, password, options: { userAttributes: { email } } });
          console.log('signUp response', response);
          console.log({ response });
          setIsLoading(false);
          setIsConfirmingAccount(true)

          if (response.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
            console.log('ha llegado');
            setModalVisible(true);
          }
          console.log('nextStep', response.nextStep);
          console.log(response.nextStep);
        } catch (error: unknown) {
          if (error instanceof Error) console.log(error.message);

          if (error instanceof Error) {
            if (error.name === 'UsernameExistsException') {
              Alert.alert('Cannot create account', 'If you already have an account, please login instead. \nDo you have a confirmation code?',
                [
                  {
                    text: 'No', onPress: () => setIsLoading(false)
                  },
                  {
                    text: 'Yes',
                    onPress: () => {
                      setIsLoading(false);
                      setModalVisible(true)
                    }
                  },
                ]);
            }
          }
        }
      }
    }
  }
  const resendCodeButton = {

    text: 'Yes', onPress: async () => {
      try {

        const resendSignUpCodeResponse = await resendSignUpCode({ username: email });
        console.log('resendSignUpCode response', resendSignUpCodeResponse);

      } catch (error: any) {
        console.error('resendSignUpCode error', error);
      } finally {
        handleCancelModal();

      }
    }
  };

  const cancelButton = { text: 'No', onPress: () => handleCancelModal() };

  async function sendConfirmationCode() {
    console.log('confirmationUserId', email);
    console.log('confirmationCode', confirmationCode);
    try {
      const response = await confirmSignUp({ username: email, confirmationCode });
      console.log('confirmSignUp response', response);
      if (response.isSignUpComplete) {
        setUserId(email);
        setIsLogged(true);
      }
    } catch (error: any) {
      if (error instanceof Error) {
        console.log('confirmSignUp error', error);
        switch (error.name) {

          case 'ExpiredCodeException':
            console.log('confirmSignUp error', error);
            Alert.alert('Code expired', 'The confirmation code has expired.\nDo you want to request a new one?.',
              [
                cancelButton,
                resendCodeButton
              ]);
            break;

          case 'LimitExceededException':
            Alert.alert('Limit exceeded', error.message,
              [
                { text: 'OK', onPress: () => handleCancelModal() }
              ]);
            break;
          case 'CodeMismatchException':
            Alert.alert('Code Mismatch', error.message + "\nDo you want to request a new one?",
              [
                cancelButton,
                resendCodeButton

              ]);
            break;
        }
      }
    }
  }
  return (
    <View style={styles.mainContainer}>

      <View style={{ width: '60%' }}>
        {isLoading && <View style={styles.loading}><ActivityIndicator size={'large'} /><Text>Loading</Text></View>}

        <SmartInput
          ref={emailRef}
          errorMessage={emailError}
          onChangeText={setEmail}
          placeholder={'Email'}
          nextRef={loginMode ? passRef : nickRef}
          value={email}
        />
        {loginMode ||
          <SmartInput
            ref={nickRef}
            errorMessage={nickError}
            onChangeText={setNick}
            placeholder="Nick"
            nextRef={passRef}
            value={nick} />}

        <Modal animationType="fade"
          transparent={true}
          visible={isModalVisible}
        >
          <TouchableOpacity
            style={[styles.mainContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={handleCancelModal}>
            <View style={styles.modalView} onStartShouldSetResponder={() => true} >
              <TextInput style={styles.modalTextInput} placeholder="Confirmation code" value={confirmationCode} onChangeText={text => setConfirmationCode(text.trim())} />
              <TouchableOpacity style={styles.modalButton} onPress={() => { confirmationCode ? sendConfirmationCode() : handleCancelModal() }}>
                <Text style={styles.modalButtonText}>{confirmationCode ? 'Send' : 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        <SmartInput
          ref={passRef}
          errorMessage={passwordError}
          onChangeText={setPassword}
          placeholder="Password"
          value={password}
        />

        <View style={[styles.horButtons, { marginTop: 10 }]}>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleAccountCreation} disabled={isLoading}>
            <Text style={styles.buttonText}>Create</Text>
            <Text style={styles.buttonText}>Acount</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View >
  )
}