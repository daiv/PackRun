import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles";

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (message: string) => void;
}

export function ChatInput({ input, setInput, sendMessage }: ChatInputProps) {
  function handleSendMessage() {
    Keyboard.dismiss();
    sendMessage(input);
    setInput('');
  }
  return <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder="Type a message..."
      value={input}
      onChangeText={setInput}
    />
    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
      <Text style={styles.sendButtonText}>Send</Text>
    </TouchableOpacity>
  </View>
}