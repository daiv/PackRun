import React, { useEffect, useState, useRef } from 'react';
import { Text, View, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from './styles';
import { getMessagesFromServer, sendMessageToServer, socket } from '../../helpers/helper';
import { useRunContext } from '../../context/RunContext';


export default function Chatscreen() {
  const [messages, setMessages] = useState<{ author: string; time: string; message: string }[]>([]);
  const [input, setInput] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const { userId } = useRunContext();
  const getMessages = async () => {
    const response = await getMessagesFromServer(userId);
    if (response && messages.length != response.length) setMessages(response);
  };

  useEffect(() => {
    socket.on('message', (message: { author: string; time: string; message: string }) => {
      setMessages(prev => [...prev, message]);
    });
    setInterval(() => {
      getMessages();
    }, 5000)
    return () => {
      socket.off('message');
    };
  }, []);

  const send = async () => {
    if (input.trim() !== '') {
      getMessages();
      sendMessageToServer(userId, input).then(() => setInput('')).catch((error) => console.error('Error sending message:', error));
      socket.emit('message', { author: userId, time: Date.now().toString(), message: input });
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
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