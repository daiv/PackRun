import { Message } from "@common";
import { useEffect, useState } from "react";
import { useConnContext } from "@context";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { socket, fetchData } = useConnContext();


  useEffect(function getInitialMessagesFromServer() {

    fetchData<Message[]>('/messages/', 'GET')
      .then(messagesArray => {
        console.log('fetchedMessages', messagesArray);
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

  async function send(message: string) {
    if (socket) socket.emit('message', { message });
    else console.error('socket error');

    setInput('');
  }
  return { messages, send, input, setInput };
}