import { Text, View } from 'react-native';
import styles from './styles';
import { RunButton } from '../../components/RunButton/RunButton';
import { Map } from '../../components/Map/Map';


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

