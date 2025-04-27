// CurrentRun.tsx
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
// import styles from './styles';
import styles from './styles';
import { useRun } from '../../context/RunContext';
import { io } from 'socket.io-client';

const socket = io('http://192.168.68.100:3000', { transports: ['websocket'] });

export default function CurrentRun() {
    const [runDetails, setRunDetails] = useState<{ time: string; pace: string; distance: string; elevation: string }>({time: '0', pace: '0', distance: '0', elevation: '0'});
    const [stillRunning, setStillrunning] = useState(false)
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
    };

    const stopRun = async () => {
        setStillrunning(false);
    }
    const startRun = async () => {
        setStillrunning(true);
    }

    return (
    <View style={styles.container}>

        <View>
            <Text style={styles.screentext}>Time: {formatTime(Number(runDetails.time))}</Text>
            <Text style={styles.screentext}>Pace: TODO</Text>
            <Text style={styles.screentext}>Distance: TODO</Text>
        </View>
        {stillRunning ? (
            <TouchableOpacity style={styles.stopbtn} onPress={stopRun}>
                <View style={{ transform: [{ rotate: '-45deg' }] }}>
                    <Text style={styles.stopbtntext}>Stop</Text>
                </View>
            </TouchableOpacity>
        ) : (
        <TouchableOpacity style={styles.stopbtn} onPress={startRun}>
            <View style={{ transform: [{ rotate: '-45deg' }] }}>
                <Text style={styles.stopbtntext}>Start</Text>
            </View>
        </TouchableOpacity>
        )}
    </View>
    );
}
