import React, { useEffect, useRef, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import styles from './styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useConnContext } from '../../context/ConnContext';
import { Run, RunResponse } from '../../types/types';

export default function RunHistory() {

  const [runs, setRuns] = useState<Run[]>([]);
  const [refresh, setRefresh] = useState(false);
  const { fetchData } = useConnContext();
  const flatListRef = useRef<FlatList>(null);

  const getRuns = async (): Promise<RunResponse[]> => {
    const runsArray = await fetchData<RunResponse[]>('/tracks/', 'GET');
    console.log('response', runsArray);
    if (runsArray?.success === false) {
      console.error('Error getting runs from server', runsArray.error);
      return [];
    } else {
      return runsArray?.data ? runsArray.data : [];
    }
  }

  useEffect(() => {
    getRuns()
      .then(runs => setRuns(
        runs.map((run: RunResponse) => {
          console.log('nº runs', runs.length);
          let seconds = (new Date(run.updatedAt).getTime() - new Date(run.createdAt).getTime()) / 1000;
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const remainingSeconds = Math.floor(seconds % 60);
          const pad = (num: number) => String(num).padStart(2, '0');
          const minPac = (hours * 60) + minutes;
          const pace = String(Math.floor(Number(run.distance) / minPac));

          return {
            id: run.trackId,
            date: new Date(run.createdAt).toDateString(),
            time: `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`,
            pace,
            distance: run.distance,
            profile: run.altitudes
          };
        }).sort((a: Run, b: Run) => Number(a.id) - Number(b.id))
      ));
    console.log('final runs', runs);
  }, [refresh]);

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      {runs.length === 0 ? <Text>no runs yet</Text> :

        <FlatList style={styles.listContainer} ref={flatListRef} data={runs} keyExtractor={(item) => item.id}
          renderItem={({ item }) => (

            <View style={styles.runCard}>

              <View style={styles.runHeader}>
                <Text style={styles.runTitle}>Run #{item.id}</Text>
                <Text style={styles.runDate}>{item.date}</Text>
              </View>

              <View style={styles.runHeader}>

                <View style={styles.runRow}>
                  <Text style={styles.runLabel}>Time: </Text>
                  <Text style={styles.runValue}>{item.time}</Text>

                </View>

                <View style={styles.runRow}>
                  <Text style={styles.runLabel}>Dist.: </Text>
                  <Text style={styles.runValue}>{item.distance} mts</Text>
                </View>

                <View style={styles.runRow}>
                  <Text style={styles.runLabel}>Pace:{item.pace}/km</Text>
                  {/* <Text style={styles.runValue}>{item.pace}</Text> */}
                </View>

              </View>

              <View style={styles.runProfile}>
                <View>
                  <LineChart areaChart height={60} hideDataPoints startFillColor="#4A90E2" startOpacity={1} endOpacity={0.3} initialSpacing={0} data={item.profile} spacing={15} thickness={3} hideRules hideYAxisText yAxisColor="#0BA5A4" xAxisColor="#0BA5A4" color="#4A90E2" />
                </View>
              </View>

            </View>

          )}
        />

      }

      <TouchableOpacity style={styles.refresh} onPress={handleRefresh} >
        <View>
          <Ionicons name="refresh-circle-sharp" size={60} color='rgba(11, 175, 74, 0.88)' />
        </View>
      </TouchableOpacity>
    </View>
  );
}
