import React, { useEffect, useState, useRef } from 'react';
import { Text, View, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from './styles';

import { useAuthContext } from '../../context/AuthContext';
import { useConnContext } from '../../context/ConnContext';


export default function Chatscreen() {
  const [messages, setMessages] = useState<{ author: string; time: string; message: string }[]>([]);
  const [input, setInput] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const { userId } = useAuthContext();
  const { socket, fetchData } = useConnContext();

  const getMessages = async () => {
    const response = await fetchData<{ author: string; time: string; message: string }[]>('/messages/', true, 'GET');
    if (response && messages.length != response.length) setMessages(response);
  };

  useEffect(() => {
    socket && socket.on('message', (message: { author: string; time: string; message: string }) => {
      setMessages(prev => [...prev, message]);
    });
    setInterval(() => {
      getMessages();
    }, 5000)
    return () => {
      socket && socket.off('message');
    };
  }, []);

  const send = async () => {
    if (input.trim() !== '') {
      getMessages();
      fetchData<{ success: boolean, message: string }>('/messages/', true, 'POST', { message: input, author: userId, time: new Date().toISOString() })
        .then(() => setInput('')).catch((error) => console.error('Error sending message:', error));
      socket && socket.emit('message', { author: userId, time: Date.now().toString(), message: input });
    }
  }

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
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
                <Text style={item.author === userId ? styles.userText : styles.othersText}>
                  {item.author}
                </Text>
                <View style={item.author === userId ? styles.userMessage : styles.othersMessage}>
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