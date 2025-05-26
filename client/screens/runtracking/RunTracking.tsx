// CurrentRun.tsx
import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
// import styles from './styles';
import styles from './styles';
import { RunDetails } from '../../components/types';
import BlinkingButton from '../../components/BlinkingButton';
import { RunContext } from '../../context/RunContext';


export default function CurrentRun() {

  const [runDetails, setRunDetails] = useState<RunDetails>(
    { time: 0, pace: '0', distance: '0', elevation: 0, speed: 0 });

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const runContext = useContext(RunContext);
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.screentext}>Time: {formatTime(runContext ? runContext.timeElapsed : 0)}</Text>
        <Text style={styles.screentext}>Speed: {runDetails.speed * 3.6} Kms/h</Text>
        <Text style={styles.screentext}>Pace: {0}/km</Text>
        <Text style={styles.screentext}>Distance: {0}</Text>
        <Text style={styles.screentext}>Elevation: {runDetails.elevation.toFixed(2)}mts</Text>
      </View>

      <BlinkingButton onPress={() => { }} blinkingText={'Stop'}>Run!</BlinkingButton>
    </View>
  );
}
