import { Message } from "@common";
import { useEffect, useState } from "react";
import { useConnContext } from "../context/ConnContext";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
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

  async function send(input: string) {
    if (socket) socket.emit('message', { message: input });
    else console.error('socket error');
  }
  return { messages, send };
}