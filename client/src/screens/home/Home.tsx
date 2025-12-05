import { Text, View } from 'react-native';
import styles from './styles';
import { Map, RunButton } from '@components';

export function Home() {

  return (
    <View style={styles.container}>
      <View style={styles.topdash}>
        <Text style={styles.dashtext}>Great day for a run!</Text>
      </View>
      <View style={styles.fullScreen}>
        <Map />
        <RunButton key='Home' />
      </View>
    </View >
  );
}

