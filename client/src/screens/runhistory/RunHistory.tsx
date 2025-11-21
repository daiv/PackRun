import React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRuns } from 'client/src/hooks';
import { RunListItem } from 'client/src/components/RunItem/RunItem';


export default function RunHistory() {

  const { runs, refreshRuns } = useRuns();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      {runs.length === 0 ?
        <Text>no runs yet</Text>
        :
        <FlatList style={styles.listContainer} data={runs} keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RunListItem run={item} />}
        />
      }

      <TouchableOpacity style={styles.refresh} onPress={refreshRuns} >
        <View>
          <Ionicons name="refresh-circle-sharp" size={60} color='rgba(11, 175, 74, 0.88)' />
        </View>
      </TouchableOpacity>
    </View>
  );
}
