// react native
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';

// extra libraries
import { LineChart } from "react-native-gifted-charts";
import { DateTime } from "luxon";

// styling
import global from '../../globals';
import styles from './styles';
import Ionicons from '@expo/vector-icons/Ionicons';


// mock runs + date & elev. profile
const lineRun1 = [{ value: 20 }, { value: 21 }, { value: 18 }, { value: 23 }, { value: 20 }, { value: 21 }, { value: 19 }, { value: 18 }, { value: 23 }, { value: 24 }, { value: 20 }, { value: 21 }, { value: 20 }, { value: 21 }, { value: 19 }, { value: 24 }, { value: 20 }, { value: 21 }, { value: 18 }, { value: 23 }, { value: 20 }, { value: 21 }, { value: 19 }];
const lineRun2 = [{ value: 21 }, { value: 23 }, { value: 19 }, { value: 20 }, { value: 18 }, { value: 21 }, { value: 19 }, { value: 19 }, { value: 20 }, { value: 19 }, { value: 21 }, { value: 23 }, { value: 18 }, { value: 21 }, { value: 19 }, { value: 19 }, { value: 21 }, { value: 23 }, { value: 19 }, { value: 20 }, { value: 18 }, { value: 21 }, { value: 19 }];
const lineRun3 = [{ value: 21 }, { value: 22 }, { value: 18 }, { value: 19 }, { value: 17 }, { value: 22 }, { value: 21 }, { value: 18 }, { value: 19 }, { value: 22 }, { value: 21 }, { value: 22 }, { value: 19 }, { value: 22 }, { value: 21 }, { value: 22 }, { value: 21 }, { value: 22 }, { value: 18 }, { value: 19 }, { value: 17 }, { value: 22 }, { value: 21 }];
const lineRun4 = [{ value: 18 }, { value: 21 }, { value: 18 }, { value: 20 }, { value: 19 }, { value: 21 }, { value: 20 }, { value: 18 }, { value: 20 }, { value: 19 }, { value: 18 }, { value: 21 }, { value: 19 }, { value: 23 }, { value: 20 }, { value: 19 }, { value: 18 }, { value: 21 }, { value: 18 }, { value: 20 }, { value: 19 }, { value: 21 }, { value: 20 }];

const mockRuns = [
  { id: '4', date: '22 Mar 2025', time: '13:08', pace: '5:08/km', distance: '2.56km', profile: lineRun4 },
  { id: '3', date: '20 Mar 2025', time: '16:07', pace: '5:00/km', distance: '3.21km', profile: lineRun3 },
  { id: '2', date: '18 Mar 2025', time: '14:11', pace: '4:43/km', distance: '3.00km', profile: lineRun2 },
  { id: '1', date: '15 Mar 2025', time: '39:23', pace: '5:37/km', distance: '7.00km', profile: lineRun1 }
];


export default function RunHistory() {

  const [runs, setRuns] = useState<{ id: string; date: string; time: string; pace: string; distance: string; profile: {}[] }[]>(mockRuns);
  const [refresh, setRefresh] = useState(false)
  const flatListRef = useRef<FlatList>(null);

  const getRuns = async () => {
    const response = await fetch(`http://192.168.1.192:3000/runs/xXBobmanXx`);
    if (!response.ok) throw new Error('Failed to fetch runs');
    const array = await response.json();
    return array;
  };


  /* useEffect( () => {
    getRuns()
    .then( arrayOfDBRuns => {
      const arrayofRuns = [];
      for (let dbRun in arrayOfDBRuns) {
        const run: { id: string; date: string; time: string; pace: string; distance: string; profile: {}[] } = { id: '', date: '', time: '', pace: '', distance: '', profile: [] };
        run.id = dbRun.trackId;
        run.date = String(DateTime.fromISO(dbRun.createdAt).toMillis());
        run.time = String(DateTime.fromMillis(DateTime.fromISO(dbRun.updatedAt).toMillis() - DateTime.fromISO(dbRun.createdAt).toMillis()).toLocaleString({minute: '2-digit', second: '2-digit', }));
        run.distance = `${(dbRun.distance / 1000).toFixed(2)}km`;
        run.pace = `${DateTime.fromSeconds(Math.floor(Number(run.time)/Number(run.distance))).toLocaleString({minute: '2-digit', second: '2-digit' })}/km`;
        run.profile = dbRun.altitudes;
        arrayofRuns.push(run);
      }
      return arrayofRuns;
    })
    .then( arrayOfRuns => setRuns(arrayOfRuns))
  }, [refresh])

  function handleRefresh () {
    setRefresh(!refresh);
  } */


  return (
    <View style={styles.container}>
      <FlatList style={styles.listContainer} ref={flatListRef} data={runs} keyExtractor={(item) => item.id} renderItem={({ item }) => (

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
              <Text style={styles.runValue}>{item.distance}</Text>
            </View>

            <View style={styles.runRow}>
              <Text style={styles.runLabel}>Pace: </Text>
              <Text style={styles.runValue}>{item.pace}</Text>
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
      <TouchableOpacity style={styles.refresh} /* onPress={handleRefresh} */>
        <View>
          <Ionicons name="refresh-circle-sharp" size={60} color='rgba(11, 175, 74, 0.88)' />
        </View>
      </TouchableOpacity>
    </View>
  );
}
