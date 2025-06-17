import { Marker, MarkerAnimated, Polyline } from 'react-native-maps';
import { Camera, MapView, MarkerView } from '@maplibre/maplibre-react-native';
import RunButton from '../../components/RunButton';
import { ActivityIndicator, Image, ImageComponent, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import styles from './styles';
import { useRunContext } from '../../context/RunContext';
import { getStadiaApiKey } from '../../helpers/helper';

import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function HomePage() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.416839178964445,
    longitude: -3.703375944773951,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [stadiaKey, setStadiaKey] = useState(null);
  const { lastKnownLocation, isRunning, reportedLocations } = useRunContext();

  const mapStyle = 'https://tiles.stadiamaps.com/styles/outdoors.json?api_key=';

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

  useEffect(function getStadiaKey() {
    getStadiaApiKey().then(response => {
      setStadiaKey(response.stadiaApiKey);
    })
      .catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topdash}>
        <Text style={styles.dashtext}>Great day for a run!</Text>
      </View>
      <View style={styles.fullScreen}>
        {stadiaKey
          ?
          <MapView style={styles.mapview} mapStyle={mapStyle + stadiaKey} >
            <Camera zoomLevel={20} centerCoordinate={[mapRegion.longitude, mapRegion.latitude]} />

            <MarkerView key={isRunning ? 'runningIcon' : 'locationIcon'} coordinate={[mapRegion.longitude, mapRegion.latitude]}>
              <View >
                {isRunning ?
                  <FontAwesome5 name="running" size={30} color="black" style={styles.icon} />
                  :
                  <Entypo name="location-pin" size={30} color="black" style={styles.icon} />
                }
              </View>
            </MarkerView>
          </MapView>
          :
          <View style={styles.fullScreen}>
            <View style={styles.loading}>
              <ActivityIndicator />
              <Text>Loading map, please wait</Text>
            </View>
          </View>}
        <RunButton />
      </View>
    </View >
  );
}

