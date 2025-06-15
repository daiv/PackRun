import { Marker, Polyline } from 'react-native-maps';
import { MapView } from '@maplibre/maplibre-react-native';
import RunButton from '../../components/RunButton';
import { Image, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import styles from './styles';
import { useRunContext } from '../../context/RunContext';

export default function HomePage() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.416839178964445,
    longitude: -3.703375944773951,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const { lastKnownLocation, isRunning, reportedLocations } = useRunContext();

  useEffect(function updateMapRegion() {
    if (lastKnownLocation) {
      setMapRegion({
        latitude: lastKnownLocation.coords.latitude,
        longitude: lastKnownLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [lastKnownLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.topdash}>
        <Text style={styles.dashtext}>Great day for a run!</Text>
      </View>
      <View style={styles.mapcontainer}>
        <MapView style={styles.mapview}></MapView>
        <RunButton />
      </View>
    </View >
  );
}

