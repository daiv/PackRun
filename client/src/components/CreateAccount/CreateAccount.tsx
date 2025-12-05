import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useRef } from "react"
import { SmartInput } from "../SmartInput/SmartInput";
import styles from "./styles";
import { useCreateAccount } from "@hooks";

export function CreateAccount({ toggleLogin }: { toggleLogin: () => void }) {

  const { isLoading,
    email, setEmail, emailError,
    password, pwError, setPassword, matchingPwd, matchingPwdError,
    nick, setNick, nickError,
    isModalVisible,
    confirmationCode,
    handleAccountConfirmation,
    handleAccountCreation,
    handleCancelModal,
    setMatchingPwd,
    setConfirmationCode,
    emailRef,
    nickRef,
    passRef,
    matchPassRef,
  } = useCreateAccount();

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