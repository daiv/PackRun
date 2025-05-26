import { TouchableOpacity, View, Text } from "react-native";
import styles from "../screens/home/styles";
import { useState, useEffect, useContext } from "react";
import { RunContext } from "../context/RunContext";

export default function BlinkingButton(
  { children, onPress, blinkingText = children?.toString() }:
    { children: React.ReactNode, onPress: () => void | undefined, blinkingText?: string }) {

  const [isVisible, setIsVisible] = useState(true);
  const context = useContext(RunContext);
  const isRunning = context?.isRunning || false;
  const setIsRunning = context?.setIsRunning || (() => { });

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => setIsVisible(prev => !prev), 500);
      return () => {
        clearInterval(interval);
        setIsRunning(false);
        setIsVisible(true);
      }
    }
  }, [isRunning]);

  function handleClick() {
    setIsRunning(isBlinking => !isBlinking);
    onPress && onPress();
  }

  return (
    <TouchableOpacity
      style={{ ...styles.startbtn, opacity: isVisible ? 1 : 0 }}
      onPress={handleClick}
    >
      <View style={{ transform: [{ rotate: '-45deg' }] }}>
        <Text style={styles.startbtntext}>{isRunning ? blinkingText : children}</Text>

      </View>
    </TouchableOpacity>
  );
}