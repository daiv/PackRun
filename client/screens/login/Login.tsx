import { TextInput, View, Text, TouchableOpacity, Alert, ActivityIndicator, Modal } from "react-native";
import { useConnContext } from "../../context/ConnContext";
import { useState, useRef } from "react";
import { styles } from './styles'
import { LoginProps } from "../../helpers/Types";
import { setHelperUserId } from "../../helpers/helper";
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';

export default function Login({ setIsLogged }: LoginProps) {
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
  const { setUserId } = useConnContext();

  const emailRef = useRef<TextInput>(null);
  const nickRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

  function areAllFieldsOk() {

    setEmailError(checkEmail());
    setPasswordError(checkPassword());
    setNickError(loginMode || nick ? '' : 'Nick can not be empty');

    return email && !emailError && password && !passwordError && (loginMode || nick && !nickError);
  }
  const checkEmail = () => !email ? 'Email can not be empty' : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) ? 'Invalid email address' : '';
  const checkPassword = () => !password ? 'Password can not be empty' : password.length < 6 ? 'Password must be at least 6 characters long' : '';///^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9\s]).+$/

  const mockRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      setIsLogged(true);
      setUserId('USER_ID');
      setHelperUserId('USER_ID');
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
  function handleLogin() {
    if (!loginMode) {
      setLoginMode(true);
      resetErrors();
    }
    else if (areAllFieldsOk()) {
      //request login
      resetFields();
      mockRequest();
    }
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
          const response = await signUp({ username: email, password });
          console.log('signUp response', response);
          setIsLoading(false);
          setIsConfirmingAccount(true)

        } catch (error) {
          console.log('signUp error', error);
        }
      }

    }
  }
  function sendConfirmationCode() {

  }
  function handleCancelModal() {
    setModalVisible(false);
    setConfirmationCode('');
  }
  return (
    <View style={styles.mainContainer}>

      <View style={{ width: '60%' }}>

        {isLoading && <View style={styles.loading}><ActivityIndicator size={'large'} /><Text>Loading</Text></View>}

        <TextInput
          ref={emailRef}
          onChangeText={setEmail}
          keyboardType="email-address"
          returnKeyType="next"
          submitBehavior="submit"
          style={[emailError && { borderColor: 'red', borderWidth: 1 }]}
          onSubmitEditing={() => { loginMode ? passRef.current && passRef.current.focus() : nickRef.current && nickRef.current.focus() }}
          placeholder="Email"
          value={email} />
        {emailError &&
          <Text style={{ color: 'red', marginBottom: 6 }}>{emailError}</Text>
        }

        {loginMode || <>
          <TextInput
            ref={nickRef}
            onChangeText={setNick}
            returnKeyType="next"
            submitBehavior="submit"
            style={[nickError && { borderColor: 'red', borderWidth: 1 }]}
            onSubmitEditing={() => { passRef.current && passRef.current.focus() }}
            placeholder="Nick"
            value={nick} />
          {nickError &&
            <Text style={{ color: 'red', marginBottom: 6 }}>{nickError}</Text>
          }
        </>
        }

        <Modal animationType="fade"
          transparent={true}
          visible={isModalVisible}
        >
          <TouchableOpacity
            style={[styles.mainContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={handleCancelModal}>
            <View style={styles.modalView} onStartShouldSetResponder={() => true} >
              <TextInput style={styles.modalTextInput} placeholder="Confirmation code" value={confirmationCode} onChangeText={setConfirmationCode} />
              <TouchableOpacity style={styles.modalButton} onPress={() => { confirmationCode ? sendConfirmationCode() : handleCancelModal() }}>
                <Text style={styles.modalButtonText}>{confirmationCode ? 'Send' : 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <TextInput
          ref={passRef}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholder="Password"
          style={[passwordError && { borderColor: 'red', borderWidth: 1 }]}
          value={password} />
        {passwordError &&
          <Text style={{ color: 'red', marginBottom: 6 }}>{passwordError}</Text>
        }

        <View style={styles.horButtons}>
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