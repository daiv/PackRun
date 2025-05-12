import { Button, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootStackParamList from '../../components/types.js';
import styles from './styles';
import { serverConnect, serverDisconnect, trackGpsPosition } from '../../helpers/helper';

export default function HomePage() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.416839178964445,
    longitude: -3.703375944773951,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  useEffect(() => {
    trackGpsPosition(30, setMapRegion);
    serverConnect();
    return () => serverDisconnect();
  }, []);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.topdash}>
        <Text style={styles.dashtext}>Great day for a run!</Text>
      </View>
      <View style={styles.mapcontainer}>
        <MapView style={styles.mapview} region={mapRegion}>
          <Marker coordinate={mapRegion} />
        </MapView>
        <TouchableOpacity
          style={styles.startbtn}
          onPress={() => { }}
        >
          <View style={{ transform: [{ rotate: '-45deg' }] }}>
            <Text style={styles.startbtntext}>Run!</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

