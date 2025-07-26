import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import SmartInput from "./SmartInput";
import { useAuth } from "../customHooks/useAuth";
import { useConnContext } from "../context/ConnContext";

export default function Login({ toggleLogin, setIsLogged }: { toggleLogin: () => void, setIsLogged: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, isUserLoggedIn, tokens } = useAuth();
  const { setUserId } = useConnContext();

  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

  useEffect(function isLoggedIn() {
    
    isUserLoggedIn().then(isLogged => {
      console.log('user is logged = ', isLogged);
      if (isLogged && tokens) {
        

      }

    }).catch(err => { console.error('error checking status') });
  }, []);

  const handleLogin = async () => {
    const currentEmailError = email ? '' : 'Email cannot be empty';
    const currentPasswordError = password ? '' : 'Password cannot be empty';

    setEmailError(currentEmailError);
    setPasswordError(currentPasswordError);

    if (currentEmailError || currentPasswordError) {
      console.warn('There are errors in the form, please fix them before proceeding.');
      return;
    }

    setIsLoading(true);
    const loginResponse = await login(email, password);
    setIsLogged(loginResponse.success);
    setIsLoading(false);
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