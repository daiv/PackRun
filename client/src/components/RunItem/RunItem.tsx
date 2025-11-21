import { memo } from "react";
import { Run } from "../../types/types";
import { Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import styles from "./styles";


export const RunListItem = memo(({ run }: { run: Run }) => {
  return <View style={styles.runCard}>

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
        {/* <Text style={styles.runValue}>{item.pace}</Text> */}
      </View>

    </View>

    <View style={styles.runProfile}>
      <View>
        <LineChart areaChart height={60} hideDataPoints startFillColor="#4A90E2" startOpacity={1} endOpacity={0.3} initialSpacing={0} data={run.profile} spacing={15} thickness={3} hideRules hideYAxisText yAxisColor="#0BA5A4" xAxisColor="#0BA5A4" color="#4A90E2" />
      </View>
    </View>

  </View>
});