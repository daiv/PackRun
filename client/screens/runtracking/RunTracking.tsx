import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import RunButton from '../../components/RunButton';
import { useRunContext } from '../../context/RunContext';


export default function CurrentRun() {
  const { timeElapsed, lastKnownLocation, isRunning } = useRunContext();

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.screentext}>Time: {formatTime(timeElapsed)}</Text>
        <Text style={styles.screentext}>Speed: {isRunning && lastKnownLocation?.coords.speed ? (lastKnownLocation.coords.speed * 3.6).toFixed(2) : 0} Kms/h</Text>
        <Text style={styles.screentext}>Pace: {0}/km</Text>
        <Text style={styles.screentext}>Distance: {0}</Text>
        <Text style={styles.screentext}>Elevation: {isRunning && lastKnownLocation?.coords.altitude ? lastKnownLocation.coords.altitude.toFixed(2) : 0}mts</Text>
      </View>

      <RunButton />
    </View>
  );
}
