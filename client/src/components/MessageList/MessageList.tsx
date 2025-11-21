import { Message } from "@common";
import { useRef, useState } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import MessageItem from "../MessageItem/MessageItem";

type MessageListProps = {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    setIsAtBottom(layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom);
  };

  return (
    <FlatList<Message>
      style={{ flex: 1 }}
      ref={flatListRef}
      data={messages}
      keyExtractor={message => message.time.toString()}
      renderItem={({ item }) => <MessageItem message={item} />}
      onContentSizeChange={() => {
        if (isAtBottom) {
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    />
  );
}

