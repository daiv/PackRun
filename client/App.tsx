// react native
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './screens/home/Home';
import RunTracking from './screens/runtracking/RunTracking';
import RunHistory from './screens/runhistory/RunHistory';
import ChatScreen from './screens/chat/chat';
import { Image } from 'react-native';

const icons = {
  run: require('./assets/run.png'),
  metrics: require('./assets/metrics.png'),
  history: require('./assets/history.png'),
  chat: require('./assets/chat.png'),
}

export default function App() {

  const NavBar = createBottomTabNavigator();
  const screenOptions = {
    headerShown: false,
  }

  return (
     <NavigationContainer>
        <NavBar.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {height: 100, paddingTop: 20}}}>
          <NavBar.Screen name={'Run'} component={HomePage} options={{tabBarIcon:({focused})=>(
            <Image source={icons.run} style={{width:37, height:37, tintColor: focused ? '#4A90E2' : '#000000'}}/>
          )}}/>
          <NavBar.Screen name='Metrics' component={RunTracking} options={{tabBarIcon:({focused})=>(
            <Image source={icons.metrics} style={{width:37, height:37, tintColor: focused ? '#4A90E2' : '#000000'}}/>
          )}}/>
          <NavBar.Screen name='History' component={RunHistory} options={{tabBarIcon:({focused})=>(
            <Image source={icons.history} style={{width:37, height:37, tintColor: focused ? '#4A90E2' : '#000000'}}/>
          )}}/>
          <NavBar.Screen name='Chat' component={ChatScreen} options={{tabBarIcon:({focused})=>(
            <Image source={icons.chat} style={{width:37, height:37, tintColor: focused ? '#4A90E2' : '#000000'}}/>
          )}}/>
        </NavBar.Navigator>
      </NavigationContainer>
  );
}