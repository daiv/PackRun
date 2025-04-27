import React, { useEffect, useState, useRef } from 'react';
import { Text, View, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import io from 'socket.io-client';
import styles from './styles';

const socket = io('http://192.168.68.101:3000', { transports: ['websocket'] });

export default function Chatscreen() {
  const [messages, setMessages] = useState<{ author: string; time: string; message: string }[]>([]);
  const [input, setInput] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const getMessages = async () => {
    const response = await fetch(`http://192.168.68.101:3000/messages/xXBobmanXx`);
    if (!response.ok) throw new Error('Failed to fetch messages');
    
    const resp = await response.json();
    setMessages(resp);
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

  const sendMessage = async () => {
    if (input.trim() !== '') {
      const userId = 'xXBobmanXx';
      const time = Date.now().toString();
      const message = { author: userId, time: time, message: input };
      try {
        const response = await fetch(`http://192.168.68.101:3000/messages/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message),
        });
  
        if (!response.ok) throw new Error('Failed to send message');
  
        await response.json();
        // console.log('Message saved:', message);
  
        socket.emit('message', message);
        setInput('');
  
        setTimeout(() => {
          botSendMessage();
        }, 5000);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const botSendMessage = async () => {
    const userId = 'Bertha Coolshoes';
    const time = Date.now().toString();
    const message = { author: userId, time: time, message: '9am saturday?' };
    try {
      const response = await fetch(`http://192.168.68.101:3000/messages/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
  
      if (!response.ok) throw new Error('Failed to send message');
  
      await response.json();
      console.log('Message saved:', message);
  
      socket.emit('message', message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ flex: 1 }}
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.time}
            renderItem={({ item }) => (
              <View>
                <Text style={item.author === 'xXBobmanXx' ? styles.userText : styles.botText}>
                  {item.author}
                </Text>
                <View style={item.author === 'xXBobmanXx' ? styles.userMessage : styles.botMessage}>
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
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
    </KeyboardAvoidingView>
  );
}