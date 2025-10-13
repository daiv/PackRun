import React, { useEffect, useState, useRef } from 'react';
import { Text, View, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import styles from './styles';

import { useAuthContext } from '../../context/AuthContext';
import { useConnContext } from '../../context/ConnContext';
import { Message } from '../../../../common/commonTypes';


export default function Chatscreen() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const { nickName } = useAuthContext();
  const { socket, fetchData } = useConnContext();


  useEffect(function getInitialMessagesFromServer() {
    fetchData<Message[]>('/messages/', 'GET')
      .then(messagesArray => {
        if (messagesArray?.success) {
          messagesArray.data && setMessages(messagesArray.data);
        } else console.error('Error getting messages', messagesArray?.error);
      });
  }, []);

  useEffect(function ioSocketInit() {
    socket && socket.on('message', (message: Message) => {
      console.log('receivedMessageSocket', message);
      setMessages(prevMess => [...prevMess, message]);
    });

    return () => { socket && socket.off('message') };
  }, []);

  async function send() {
    if (socket) socket.emit('message', { message: input });
    else console.error('socket error');
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
            <TouchableOpacity style={styles.sendButton} onPress={send}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}