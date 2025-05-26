import { TouchableOpacity, View, Text } from "react-native";
import styles from "../screens/home/styles";
import { useState, useEffect } from "react";

export default function BlinkingButton(
  { children, onPress, blinkingText = children?.toString() }:
    { children: React.ReactNode, onPress: () => void, blinkingText?: string }) {

  const [isVisible, setIsVisible] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (isBlinking) {
      const interval = setInterval(() => setIsVisible(prev => !prev), 500);
      return () => {
        clearInterval(interval);
        setIsBlinking(false);
        setIsVisible(true);
      }
    }
  }, [isBlinking]);

  function handleClick() {
    setIsBlinking(isBlinking => !isBlinking);
    onPress && onPress();
  }

  return (
    <TouchableOpacity
      style={{ ...styles.startbtn, opacity: isVisible ? 1 : 0 }}
      onPress={handleClick}
    >
      <View style={{ transform: [{ rotate: '-45deg' }] }}>
        <Text style={styles.startbtntext}>{isBlinking ? blinkingText : children}</Text>

      </View>
    </TouchableOpacity>
  );
}