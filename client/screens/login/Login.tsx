import { TextInput, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useConnContext } from "../../context/ConnContext";
import { useState, useRef } from "react";
import { styles } from './styles'
import { LoginProps } from "../../helpers/Types";

export default function Login({ setIsLogged }: LoginProps) {
  const [email, setEmail] = useState('email');//todo replace 'email' with ''
  const [password, setPassword] = useState('pass'); //todo replace 'pass' with ''
  const [nick, setNick] = useState('');
  const [loginMode, setLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserId } = useConnContext();

  const emailRef = useRef<TextInput>(null);
  const aliasRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

  function areAllFieldsOk() {
    if (!email) {
      Alert.alert('Error', 'Email can not be empty');
      return false;
    }
    else if (!password) {
      Alert.alert('Error', 'Password can not be empty');
      return false;
    }
    else if (!loginMode && !nick) {
      Alert.alert('Error', 'Nick can not be empty');
      return false;
    }
    return true;
  }

  const mockRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      setIsLogged(true);
      setUserId('USER_ID');
    }
      , 1000);
  }

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setNick('');
  }

  function handleLogin() {
    if (!loginMode) setLoginMode(true);
    else if (areAllFieldsOk()) {
      //request login
      resetFields();
      mockRequest();
    }
  }

  function handleAccountCreation() {
    if (loginMode) setLoginMode(false);
    else if (areAllFieldsOk()) {
      //request create account
      resetFields();
      mockRequest();
    }
  }

  return (
    <View style={styles.mainContainer}>

      <View style={{ width: '60%' }}>

        {isLoading && <View style={styles.loading}><ActivityIndicator /><Text>Loading</Text></View>}

        <TextInput
          ref={emailRef}
          onChangeText={setEmail}
          keyboardType="email-address"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => { loginMode ? passRef.current && passRef.current.focus() : aliasRef.current && aliasRef.current.focus() }}
          placeholder="Email"
          value={email} />

        {loginMode || <TextInput
          ref={aliasRef}
          onChangeText={setNick}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => { passRef.current && passRef.current.focus() }}
          placeholder="Alias"
          value={nick} />
        }

        <TextInput
          ref={passRef}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholder="Password"
          value={password} />

        <View style={styles.horButtons}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleAccountCreation}>
            <Text style={styles.buttonText}>Create</Text>
            <Text style={styles.buttonText}>Acount</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View >
  )
}