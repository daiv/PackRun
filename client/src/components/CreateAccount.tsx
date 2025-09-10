import { ActivityIndicator, Alert, Modal, Text, TextInput, TouchableOpacity, View } from "react-native"
import { avoidFirstRender, checkEmail, checkPassword } from "../helpers/helper";
import { useEffect, useRef, useState } from "react"
import SmartInput from "./SmartInput";
import styles from "./styles";
import { useAuthContext } from "../context/AuthContext";


export default function CreateAccount({ toggleLogin }: { toggleLogin: () => void }) {

  const [email, setEmail] = useState('');
  const [nick, setNick] = useState('');
  const [password, setPassword] = useState('');
  const [matchingPwd, setMatchingPwd] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');

  const [emailError, setEmailError] = useState('');
  const [nickError, setNickError] = useState('');
  const [pwError, setPwError] = useState('');
  const [matchingPwdError, setMatchingPwdError] = useState('');

  const [isModalVisible, setModalVisible] = useState(false);


  const { createAccount, confirmAccount, resendConfirmationCode, login, getTokens, isLoading } = useAuthContext();

  const emailRef = useRef<TextInput>(null);
  const nickRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const matchPassRef = useRef<TextInput>(null);

  const isFirstEmailRender = useRef(true);
  const isFirstPwdRender = useRef(true);
  const isFirstNickRender = useRef(true);


  useEffect(() => avoidFirstRender(isFirstEmailRender, setEmailError, 'email', email), [email]);
  useEffect(() => avoidFirstRender(isFirstPwdRender, setPwError, 'password', password), [password]);
  useEffect(() => avoidFirstRender(isFirstNickRender, setNickError, 'nick', nick), [nick]);
  useEffect(() => { setMatchingPwdError(password === matchingPwd ? '' : 'Passwords does not match') }, [password, matchingPwd]);

  function handleCancelModal() {
    setModalVisible(false);
    setConfirmationCode('');
  }
  async function handleAccountCreation() {

    const currentEmailError = checkEmail(email);
    const currentNickError = nick ? '' : 'Nick can not be empty';
    const currentPasswordError = checkPassword(password);
    const currentPasswordMatchError = password !== matchingPwd;

    setEmailError(currentEmailError);
    setNickError(currentNickError);
    setPwError(currentPasswordError);

    if (currentEmailError || currentNickError || currentPasswordError || currentPasswordMatchError) {
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
      if (loginResponse.success) getTokens();

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

  return (
    <>
      <Text style={styles.title}>Create account</Text>
      {isLoading && <View style={styles.loading}><ActivityIndicator size={'large'} /><Text>Loading</Text></View>}
      <SmartInput
        ref={emailRef}
        errorMessage={emailError}
        onChangeText={setEmail}
        placeholder={'Email'}
        nextRef={nickRef}
        value={email}
      />
      {
        <SmartInput
          ref={nickRef}
          errorMessage={nickError}
          onChangeText={setNick}
          placeholder="Nick"
          nextRef={passRef}
          value={nick} />
      }

      <Modal animationType="fade"
        transparent={true}
        visible={isModalVisible}
      >
        <TouchableOpacity
          style={[styles.mainContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={handleCancelModal}>
          <View style={styles.modalView} onStartShouldSetResponder={() => true} >
            <TextInput style={styles.modalTextInput} placeholder="Confirmation code" value={confirmationCode} onChangeText={text => setConfirmationCode(text.trim())} />
            <TouchableOpacity style={styles.modalButton}
              onPress={() => { confirmationCode ? handleAccountConfirmation() : handleCancelModal() }}>
              <Text style={styles.modalButtonText}>{confirmationCode ? 'Send' : 'Cancel'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <SmartInput
        ref={passRef}
        errorMessage={pwError}
        onChangeText={setPassword}
        placeholder="Password"
        nextRef={matchPassRef}
        value={password}
      />
      <SmartInput
        ref={matchPassRef}
        errorMessage={matchingPwdError}
        onChangeText={setMatchingPwd}
        placeholder="Repeat password"
        value={matchingPwd}
      />


      <View style={[styles.horButtons, { marginTop: 10 }]}>
        <TouchableOpacity style={styles.button} onPress={toggleLogin} disabled={isLoading}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleAccountCreation} disabled={isLoading}>
          <Text style={styles.buttonText}>Create</Text>
          <Text style={styles.buttonText}>Acount</Text>
        </TouchableOpacity>

      </View >
    </>
  );
}