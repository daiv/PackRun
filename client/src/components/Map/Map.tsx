import { ActivityIndicator, Text, View } from 'react-native';
import { Camera, MapView, MarkerView, LineLayer, ShapeSource } from '@maplibre/maplibre-react-native';
import styles from './styles';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useMap } from '@hooks';

export function Map() {

  const { stadiaKey, mapStyle, mapRegion, isRunning, route, isConnected, error } = useMap();

  if (stadiaKey)
    return (
      <MapView style={styles.mapview} mapStyle={mapStyle + stadiaKey} >
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
    );

  else return (
    <View style={styles.fullScreen}>
      <View style={styles.loading}>
        <ActivityIndicator />
        <Text>{!isConnected
          ? 'Connecting to the server, please wait'
          : error
            ? error
            : 'Loading map, please wait'
        }
        </Text>
      </View>
    </View>
  );
}
