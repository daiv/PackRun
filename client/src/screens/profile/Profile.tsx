import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import styles from "./styles";
import { useAuthContext } from "../../context/AuthContext";
import { useConnContext } from "../../context/ConnContext";
import Entypo from '@expo/vector-icons/Entypo';
import { useFocusEffect } from "@react-navigation/native";

export default function Profile() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const editRef = useRef<TextInput>(null);
  const { getUser, logout } = useAuthContext();
  const { fetchData } = useConnContext();

  useFocusEffect(useCallback(() => {
    return () => {
      console.warn('Profile screen unfocused, resetting edit state');
      setIsEditingNick(false);
      setNewNickname(nickname);
      setIsLoading(false);
    }
  }, [])
  );

  useEffect(() => {
    getUser().then(user => {
      if (user && user.signInDetails && user.signInDetails.loginId) {
        setEmail(user.signInDetails.loginId);
      } else {
        console.warn('No user data found');
      }
    });
  }, []);

  useEffect(function getDesiredNickname() {
    fetchData<{ desiredNickname: string }>('/profile/', 'GET', null)
      .then(response => {
        if (response?.success) {
          if (response.data?.desiredNickname) {
            setNickname(response.data.desiredNickname);
            setNewNickname(response.data.desiredNickname);
          }
        } else console.error('Error fetching desired nickname:', response?.error);
      })
  }, []);

  useEffect(function getFocusOnEdit() {
    if (isEditingNick) editRef.current?.focus();

  }, [isEditingNick]);

  const handleEditClick = async () => {
    if (isEditingNick && nickname !== newNickname) {
      setIsLoading(true);
      const response = await fetchData('/profile', 'POST', { desiredNickname: newNickname });
      if (response?.success) {
        setNickname(newNickname);
        console.warn('Nickname updated successfully');
      } else {
        setNewNickname(nickname);
        console.error('Error updating nickname', response?.error);
      }

      setIsEditingNick(false);
      setIsLoading(false);
    } else {
      if (isEditingNick) setNewNickname(nickname);
      setIsEditingNick(editing => !editing);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Profile</Text>
      <View style={styles.contentArea}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
        <View style={styles.editableRow}>
          <Text style={styles.label}>Nickname:</Text>
          {isEditingNick
            ?
            <TextInput ref={editRef} onChangeText={setNewNickname} style={styles.valueText}>{newNickname}</TextInput>
            :
            <Text style={styles.valueText}>{nickname}</Text>
          }
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditClick}
          >
            {(isEditingNick && nickname !== newNickname)
              ?
              <Entypo name="save" size={24} color="black" />
              :
              <Entypo name="edit" size={20} color="#333" />

            }
          </TouchableOpacity>
        </View>
        {isLoading && <View style={styles.loading}><ActivityIndicator size={'large'} /><Text>Loading</Text></View>}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View >
  );
};
