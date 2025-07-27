import { useEffect, useState } from "react";
import { useAuth } from "../../customHooks/useAuth";
import { View, Text, Touchable, TouchableOpacity } from "react-native";
import styles from "./styles";
import { useConnContext } from "../../context/ConnContext";

export default function Profile() {
  const [email, setEmail] = useState('');
  const { getUser, logout } = useAuth();
  const { updateCredentials } = useConnContext();
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
    <View>
      <Text style={{ alignSelf: 'center' }}>{email}</Text>
      <TouchableOpacity style={styles.button} onPress={async () => {
        const logoutResponse = await logout();
        updateCredentials(undefined, '');

      }} >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>


    </View>


  );
}