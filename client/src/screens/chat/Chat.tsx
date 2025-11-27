import React, { useState } from 'react';
import {
  Text, View, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import styles from './styles';

import { useChat } from '@hooks';
import { ChatInput } from '../../components/ChatInput/ChatInput';
import { MessageList } from '../../components/MessageList/MessageList';

export function Chat() {

  const [input, setInput] = useState('');
  const { messages, send } = useChat();

  async function handleSendMessage() {
    send(input);
    setInput('');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, paddingTop: 25 }}>
          <Text style={styles.title}>Chat</Text>

          <MessageList messages={messages} />

          <ChatInput input={input} setInput={setInput} sendMessage={handleSendMessage} />

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}