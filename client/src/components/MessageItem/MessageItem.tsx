import { Message } from "@common";
import { useAuthContext } from "client/src/context/AuthContext";
import { Text, View } from "react-native";
import styles from "./styles";

export default function MessageItem({ message }: { message: Message }) {
  const { nickName } = useAuthContext();
  return <View>
    <Text style={message.author === nickName ? styles.userText : styles.othersText}>
      {message.author}
    </Text>
    <View style={message.author === nickName ? styles.userMessage : styles.othersMessage}>
      <Text style={styles.messageText}>{message.message}</Text>
    </View>
  </View>
}