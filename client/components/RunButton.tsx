import { TouchableOpacity, View, Text } from "react-native";
import styles from "../screens/home/styles";
import { useState, useEffect } from "react";
import { useRunContext } from "../context/RunContext";

export default function RunButton() {

  const [isVisible, setIsVisible] = useState(true);
  const context = useRunContext();
  const { isRunning, toogleRunning } = context;

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => setIsVisible(prev => !prev), 500);
      return () => {
        clearInterval(interval);
        toogleRunning();
        setIsVisible(true);
      }
    }
  }, [isRunning]);

  const handleClick = toogleRunning

  return (
    <TouchableOpacity
      style={{ ...styles.startbtn, backgroundColor: isRunning ? 'rgba(236, 97, 35, 0.88)' : 'rgba(48, 172, 77, 1)' }}
      onPress={handleClick}
    >
      <View style={{ transform: [{ rotate: '-45deg' }] }}>

        <Text style={{ ...styles.startbtntext, opacity: isVisible ? 1 : 0 }}>{isRunning ? 'Stop' : 'Run!'}</Text>
      </View>
    </TouchableOpacity>
  );
}