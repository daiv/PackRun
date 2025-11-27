import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import styles from "./styles";
import { useRunContext } from "@context";
import { RunButtonStyleProps } from "../../types/types";

export function RunButton({ bottom }: RunButtonStyleProps) {

  const [isVisible, setIsVisible] = useState(true);
  const { isRunning, toogleRunning } = useRunContext();

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

  const handleClick = toogleRunning;

  let customStyle = bottom
    ?
    { ...styles.startbtn, backgroundColor: isRunning ? 'rgba(236, 97, 35, 0.88)' : 'rgba(48, 172, 77, 1)', bottom }
    :
    { ...styles.startbtn, backgroundColor: isRunning ? 'rgba(236, 97, 35, 0.88)' : 'rgba(48, 172, 77, 1)', }

  return (
    <TouchableOpacity style={customStyle}
      onPress={handleClick}
    >
      <View style={{ transform: [{ rotate: '-45deg' }] }}>

        <Text style={{ ...styles.startbtntext, opacity: isVisible ? 1 : 0 }}>{isRunning ? 'Stop' : 'Run!'}</Text>
      </View>
    </TouchableOpacity >
  );
}