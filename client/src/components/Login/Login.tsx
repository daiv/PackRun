import { useRef } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { SmartInput } from "../SmartInput/SmartInput";
import { useLogin } from "@hooks";

export function Login({ toggleLogin }: { toggleLogin: () => void }) {
  const { email, setEmail, emailError, password, setPassword, passwordError, handleLogin, isLoading } = useLogin();
  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

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