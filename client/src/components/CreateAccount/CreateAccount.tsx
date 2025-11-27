import { ActivityIndicator, Alert, Modal, Text, TextInput, TouchableOpacity, View } from "react-native"
import { checkEmail, checkPassword, checkNick, checkMatchingPasswords } from "../../helpers/helper";
import { useRef, useState } from "react"
import { SmartInput } from "../SmartInput/SmartInput";
import styles from "./styles";
import { useAuthContext, useConnContext } from "@context";
import { useValidatedState } from "@hooks";

export function CreateAccount({ toggleLogin }: { toggleLogin: () => void }) {

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

      <SmartInput
        ref={nickRef}
        errorMessage={nickError}
        onChangeText={setNick}
        placeholder="Nick"
        nextRef={passRef}
        value={nick} />


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