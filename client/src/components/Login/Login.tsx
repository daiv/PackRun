import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import SmartInput from "../SmartInput/SmartInput";
import { useAuthContext } from "../../context/AuthContext";

export default function Login({ toggleLogin }: { toggleLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, getTokens, isLoading } = useAuthContext();

  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

  useEffect(() => { getTokens() }, []);

  const handleLogin = async () => {
    const currentEmailError = email ? '' : 'Email cannot be empty';
    const currentPasswordError = password ? '' : 'Password cannot be empty';

    setEmailError(currentEmailError);
    setPasswordError(currentPasswordError);

    if (currentEmailError || currentPasswordError) {
      console.warn('There are errors in the form, please fix them before proceeding.');
      return;
    }

    const loginResponse = await login(email, password);

    console.log('loginResponse', loginResponse);
    if (loginResponse.success) {
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
    }
  }

  return (
    <>
      <Text style={styles.title}>Log in</Text>
      {isLoading && <View style={styles.loading}><ActivityIndicator size={'large'} /><Text>Loading</Text></View>}

      <SmartInput
        ref={emailRef}
        errorMessage={emailError}
        onChangeText={setEmail}
        placeholder={'Email'}
        nextRef={passRef}
        value={email}
      />
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

        <TouchableOpacity style={styles.button} onPress={toggleLogin} disabled={isLoading}>
          <Text style={styles.buttonText}>Create</Text>
          <Text style={styles.buttonText}>Acount</Text>
        </TouchableOpacity>

      </View >
    </>
  );
}