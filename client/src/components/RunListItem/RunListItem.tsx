import { memo } from "react";
import { Alert, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Run } from "../../types/types";
import styles from "./styles";
import FontAwesome from '@expo/vector-icons/FontAwesome';


export const RunListItem = memo(({ run, deleteRun }: { run: Run, deleteRun: (arg: string) => Promise<boolean> }) => {
  return <View style={styles.runCard}>

    <TouchableOpacity onPress={async () => {
      Alert.alert('Delete Run', 'Are you sure you want to delete this run?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { deleteRun(run.id) || ToastAndroid.show('Unable to delete Run ', ToastAndroid.SHORT) } }]);
    }} >

      <FontAwesome name="trash-o" size={24} color="black" style={{ alignSelf: 'flex-end' }} />
    </TouchableOpacity>

    <View style={styles.runHeader}>
      <Text style={styles.runTitle}>Run #{run.id}</Text>
      <Text style={styles.runDate}>{run.date}</Text>
    </View>

    <View style={styles.runHeader}>

      <View style={styles.runRow}>
        <Text style={styles.runLabel}>Time: </Text>
        <Text style={styles.runValue}>{run.time}</Text>

      </View>

      <View style={styles.runRow}>
        <Text style={styles.runLabel}>Dist.: </Text>
        <Text style={styles.runValue}>{run.distance} mts</Text>
      </View>

      <View style={styles.runRow}>
        <Text style={styles.runLabel}>Pace:{run.pace}/km</Text>
      </View>

    </View>

    <View style={styles.runProfile}>
      <View>
        <LineChart areaChart height={60} hideDataPoints startFillColor="#4A90E2" startOpacity={1} endOpacity={0.3} initialSpacing={0} data={run.profile} spacing={15} thickness={3} hideRules hideYAxisText yAxisColor="#0BA5A4" xAxisColor="#0BA5A4" color="#4A90E2" />
      </View>
    </View>

  </View>
});