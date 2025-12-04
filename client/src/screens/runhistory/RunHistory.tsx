import React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRuns } from '@hooks';
import { RunListItem } from '../../components/RunListItem/RunListItem';
import styles from './styles';


export function RunHistory() {

  const { runs, refreshRuns, deleteRun } = useRuns();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      {runs.length === 0 ?
        <Text>no runs yet</Text>
        :
        <FlatList style={styles.listContainer} data={runs} keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RunListItem run={item} deleteRun={deleteRun} />}
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
