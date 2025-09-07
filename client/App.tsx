import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, SafeAreaView, StatusBar } from 'react-native';
import { RunProvider } from './context/RunContext';
import { ConnProvider } from './context/ConnContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Home from './screens/home/Home';
import CurrentRun from './screens/currentRun/CurrentRun';
import RunHistory from './screens/runhistory/RunHistory';
import Chat from './screens/chat/chat';
import Auth from './screens/authentication/Auth';
import Profile from './screens/profile/Profile';
import './amplify-config';


const icons = {
  run: require('./assets/run.png'),
  metrics: require('./assets/metrics.png'),
  history: require('./assets/history.png'),
  chat: require('./assets/chat.png'),
}

function MainAppNavigator() {
  const { userId } = useAuthContext();
  const NavBar = createBottomTabNavigator();
  const screenOptions = { headerShown: false, tabBarShowLabel: false, tabBarStyle: { height: 100, paddingTop: 20 } }

  if (userId) {
    return (
      <NavigationContainer>
        <NavBar.Navigator screenOptions={screenOptions}>
          <NavBar.Screen name={'Home'} component={Home} options={{
            tabBarIcon: ({ focused }) => (
              <Image source={icons.run} style={{ width: 37, height: 37, tintColor: focused ? '#4A90E2' : '#000000' }} />
            )
          }} />
          <NavBar.Screen name={'CurrentRun'} component={CurrentRun} options={{
            tabBarIcon: ({ focused }) => (
              <Image source={icons.metrics} style={{ width: 37, height: 37, tintColor: focused ? '#4A90E2' : '#000000' }} />
            )
          }} />
          <NavBar.Screen name='RunHistory' component={RunHistory} options={{
            tabBarIcon: ({ focused }) => (
              <Image source={icons.history} style={{ width: 37, height: 37, tintColor: focused ? '#4A90E2' : '#000000' }} />
            )
          }} />
          <NavBar.Screen name='Chat' component={Chat} options={{
            tabBarIcon: ({ focused }) => (
              <Image source={icons.chat} style={{ width: 37, height: 37, tintColor: focused ? '#4A90E2' : '#000000' }} />
            )
          }} />
          <NavBar.Screen name='Profile' component={Profile} options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons name="account" size={40}
                color={focused ? '#4A90E2' : '#000000'}
                style={{ width: 37, height: 37, }} />
              // <AntDesign name="user" size={30} color={focused ? '#4A90E2' : '#000000'} />
            )
          }} />
        </NavBar.Navigator>
      </NavigationContainer>
    )
  } else return <Auth />
}

export default function App() {
  return (
    <AuthProvider>
      <ConnProvider>
        <RunProvider>
          <SafeAreaView style={{ flex: 1, paddingTop: 10 }}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <MainAppNavigator />
          </SafeAreaView>
        </RunProvider>
      </ConnProvider>
    </AuthProvider >
  );
}