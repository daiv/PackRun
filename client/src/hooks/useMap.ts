import { useEffect, useState } from "react";
import { useStadiakey } from "./useStadiaKey";
import { useRunContext } from "@context";

const initialRegion = {
  latitude: 38.34500514207054,
  longitude: -0.49060323026266806,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

export function useMap() {
  const { stadiaKey, error, isConnected } = useStadiakey();
  const mapStyle = 'https://tiles.stadiamaps.com/styles/outdoors.json?api_key=' + stadiaKey || '';
  const { route, isRunning, lastKnownLocation } = useRunContext();
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
  return { stadiaKey, mapStyle, error, isConnected, mapRegion, isRunning, route };
}