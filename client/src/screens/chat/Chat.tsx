import React, { useState, useRef } from 'react';
import {
  Text, View, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, Keyboard, NativeSyntheticEvent, NativeScrollEvent
} from 'react-native';
import styles from './styles';

import { useAuthContext } from '../../context/AuthContext';
import { useChat } from 'client/src/hooks/useChat';


export default function Chatscreen() {

  const [input, setInput] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const { nickName } = useAuthContext();

  const { messages, send } = useChat();

  async function handleSendMessage() {
    send(input);
    setInput('');
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    setIsAtBottom(layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, paddingTop: 25 }}>
          <Text style={styles.title}>Chat</Text>
          <FlatList
            style={{ flex: 1 }}
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.time}
            renderItem={({ item }) => (
              <View>
                <Text style={item.author === nickName ? styles.userText : styles.othersText}>
                  {item.author}
                </Text>
                <View style={item.author === nickName ? styles.userMessage : styles.othersMessage}>
                  <Text style={styles.messageText}>{item.message}</Text>
                </View>
              </View>
            )}
            onContentSizeChange={() => {
              if (isAtBottom) {
                flatListRef.current?.scrollToEnd({ animated: true });
              }
            }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
          <View style={styles.inputContainer}>
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}