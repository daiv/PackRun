import MapView, { Marker, Polyline } from 'react-native-maps';
import RunButton from '../../components/RunButton';
import { Image, Text, View } from 'react-native';
import { useState } from 'react';
import styles from './styles';

export default function HomePage() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.416839178964445,
    longitude: -3.703375944773951,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  return (
    <View style={styles.container}>
      <View style={styles.topdash}>
        <Text style={styles.dashtext}>Great day for a run!</Text>
      </View>
      <View style={styles.mapcontainer}>
        <MapView style={styles.mapview} region={mapRegion}>
          <Marker coordinate={mapRegion}>
            <Image source={require('../../assets/running.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
          </Marker>
          <Polyline coordinates={[{ latitude: 40.416839178964445, longitude: -3.703375944773951 }, { latitude: 42.38400323278806, longitude: -3.90 }]} strokeWidth={10}></Polyline>
        </MapView>
        <RunButton />
      </View>
    </View >
  );
}

