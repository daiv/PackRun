import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthContext } from "@context";

import { Home, CurrentRun, RunHistory, Chat, Auth, Profile } from "@screens";

import { styles } from "./styles";

export function MainApp() {
  const { userId } = useAuthContext();
  const NavBar = createBottomTabNavigator();
  const screenOptions = { headerShown: false, tabBarShowLabel: false, tabBarStyle: { height: 100, paddingTop: 20 } }

  if (userId) {
    const icons = {
      run: require('../../../assets/run.png'),
      metrics: require('../../../assets/metrics.png'),
      history: require('../../../assets/history.png'),
      chat: require('../../../assets/chat.png'),
    }
    return (
      <NavigationContainer>
        <NavBar.Navigator screenOptions={screenOptions}>
          <NavBar.Screen name={'Home'} component={Home} options={{
            tabBarIcon: ({ focused }) => (
              <Image source={icons.run} style={[styles.imageBase, focused ? styles.imageFocused : styles.imageDefault]} />
            )
          }} />
          <NavBar.Screen name={'CurrentRun'} component={CurrentRun} options={{
            tabBarIcon: ({ focused }) => (
              <Image source={icons.metrics} style={[styles.imageBase, focused ? styles.imageFocused : styles.imageDefault]} />
            )
          }} />
          <NavBar.Screen name='RunHistory' component={RunHistory} options={{
            tabBarIcon: ({ focused }) => (
              <Image source={icons.history} style={[styles.imageBase, focused ? styles.imageFocused : styles.imageDefault]} />
            )
          }} />
          <NavBar.Screen name='Chat' component={Chat} options={{
            tabBarIcon: ({ focused }) => (
              <Image source={icons.chat} style={[styles.imageBase, focused ? styles.imageFocused : styles.imageDefault]} />
            )
          }} />
          <NavBar.Screen name='Profile' component={Profile} options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons name="account" size={40}
                color={focused ? '#4A90E2' : '#000000'}
                style={styles.imageBase} />
            )
          }} />
        </NavBar.Navigator>
      </NavigationContainer>
    )
  } else return <Auth />
}