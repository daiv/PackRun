import { Image, ImageSourcePropType } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthContext } from "@context";
import { Home, CurrentRun, RunHistory, Chat, Auth, Profile } from "@screens";
import { styles } from "./styles";

const screenOptions = { headerShown: false, tabBarShowLabel: false, tabBarStyle: { height: 100, paddingTop: 20 } }
const screens: Array<{ icon: ImageSourcePropType, view: React.FC }> = [
  { icon: require('@assets/run.png'), view: Home },
  { icon: require('@assets/metrics.png'), view: CurrentRun },
  { icon: require('@assets/history.png'), view: RunHistory },
  { icon: require('@assets/chat.png'), view: Chat },
  { icon: 'account', view: Profile }
];

export function MainApp() {
  const { userId } = useAuthContext();
  const NavBar = createBottomTabNavigator();

  return userId === null
    ?
    <Auth />
    :
    <NavigationContainer>
      <NavBar.Navigator screenOptions={screenOptions}>
        {screens.map(({ view: screen, icon }) => (
          <NavBar.Screen
            name={screen.name}
            component={screen}
            options={{
              tabBarIcon: ({ focused }) => {
                if (typeof icon !== 'string') {
                  return <Image source={icon} style={[styles.imageBase, focused ? styles.imageFocused : styles.imageDefault]} />
                } else return <MaterialCommunityIcons name="account" size={40}
                  color={focused ? '#4A90E2' : '#000000'}
                  style={styles.imageBase} />
              }
            }}
          />))
        }
      </NavBar.Navigator>
    </NavigationContainer>
}