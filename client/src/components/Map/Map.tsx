import { useEffect, useState } from "react";
import { useConnContext } from "../../context/ConnContext";
import { Camera, MapView, MarkerView, LineLayer, ShapeSource } from '@maplibre/maplibre-react-native';
import { ActivityIndicator, Text, View } from 'react-native';
import styles from './styles';

import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRunContext } from "../../context/RunContext";

function useStadiakey() {
  const [stadiaKey, setStadiaKey] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const { fetchData, isConnected } = useConnContext();

  useEffect(function getStadia() {
    if (isConnected && !stadiaKey)
      fetchData<{ stadiaApiKey: string } | null>('/api/stadia/', 'GET', null)
        .then(response => {
          if (response?.success) response.data?.stadiaApiKey && setStadiaKey(response.data.stadiaApiKey);
          else setError(response?.error);
        });
  }, [isConnected]);

  return { stadiaKey, error, isConnected };
}

export function Map() {

  const { stadiaKey, error, isConnected } = useStadiakey();
  const mapStyle = 'https://tiles.stadiamaps.com/styles/outdoors.json?api_key=' + stadiaKey || '';
  const { route, isRunning, lastKnownLocation } = useRunContext();
  const initialRegion = {
    latitude: 38.34500514207054,
    longitude: -0.49060323026266806,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };
  const [mapRegion, setMapRegion] = useState(initialRegion);
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

  if (stadiaKey)
    return <MapView style={styles.mapview} mapStyle={mapStyle + stadiaKey} >
      <Camera zoomLevel={20} centerCoordinate={[mapRegion.longitude, mapRegion.latitude]} />

      <MarkerView key={isRunning ? 'runningIcon' : 'locationIcon'} coordinate={[mapRegion.longitude, mapRegion.latitude]}>
        <View >
          {isRunning ?
            <FontAwesome5 name="running" size={30} color="black" style={styles.markerIcon} />
            :
            <Entypo name="location-pin" size={30} color="black" style={styles.markerIcon} />
          }
        </View>
      </MarkerView>
      {route &&
        <ShapeSource id="route" shape={route}>
          <LineLayer id='route-style' style={{ lineWidth: 5, lineColor: '#4A90E2' }}></LineLayer>
        </ShapeSource>
      }
    </MapView>

  else return (
    <View style={styles.fullScreen}>
      <View style={styles.loading}>
        <ActivityIndicator />
        <Text>{
          !isConnected ? 'Connecting to the server, please wait'
            : error ? error
              : 'Loading map, please wait'
        }</Text>
      </View>
    </View>);
}
