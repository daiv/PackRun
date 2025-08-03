import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { useAuthContext } from "../../context/AuthContext";

export default function Profile() {
  const [email, setEmail] = useState('');
  const { getUser, logout } = useAuthContext();;

  useEffect(() => {
    getUser().then(user => {
      if (user && user.signInDetails && user.signInDetails.loginId) {
        setEmail(user.signInDetails.loginId);
      } else {
        console.warn('No user data found');
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ alignSelf: 'center' }}>{email}</Text>
      <TouchableOpacity style={styles.button} onPress={async () => {
        const logoutResponse = await logout();
      }} >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>


    </View>


  );
}