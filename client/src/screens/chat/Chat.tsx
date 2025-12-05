import React from 'react';
import { Text, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from './styles';
import { useChat } from '@hooks';
import { ChatInput, MessageList } from '@components';

export function Chat() {

  const { messages, send, input, setInput } = useChat();

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
          <ChatInput input={input} setInput={setInput} sendMessage={send} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}