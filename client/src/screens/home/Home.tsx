import RunButton from '../../components/RunButton';
import { Text, View } from 'react-native';
import styles from './styles';
import { Map } from 'client/src/components/Map';

export default function HomePage() {

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

