import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import { useRunContext } from '@context';
import { RunButton } from '@components';


export function CurrentRun() {
  const { secondsElapsed, lastKnownLocation, isRunning, metersRan } = useRunContext();

  function formatTime() {
    const mins = Math.floor(secondsElapsed / 60);
    const secs = secondsElapsed % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  function formatPace() {
    if (metersRan === 0) return "0:00";
    else {
      const secsPer1km = secondsElapsed / metersRan * 1000;
      const mins = Math.floor(secsPer1km / 60);
      const secs = Math.round(secsPer1km % 60);
      return mins < 10 ? `0${mins}:${secs}` : `${mins}:${secs}`;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Running</Text>
      <View style={{ margin: 15 }}>
        <Text style={styles.screentext}>Time: {formatTime()}</Text>
        <Text style={styles.screentext}>Speed: {isRunning && lastKnownLocation?.coords.speed ? (lastKnownLocation.coords.speed * 3.6).toFixed(2) : 0} Kms/h</Text>
        <Text style={styles.screentext}>Pace: {formatPace()} min/km</Text>
        <Text style={styles.screentext}>Distance: {metersRan} mts</Text>
        <Text style={styles.screentext}>Elevation: {isRunning && lastKnownLocation?.coords.altitude ? lastKnownLocation.coords.altitude.toFixed(2) : 0} mts</Text>
      </View>
      <RunButton key='RunTracking' bottom={3} />
    </View>
  );
}
