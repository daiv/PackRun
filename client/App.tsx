import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, SafeAreaView } from 'react-native';
import { RunProvider } from './context/RunContext';
import { ConnProvider } from './context/ConnContext';
import { useState } from 'react';

import Home from './screens/home/Home';
import CurrentRun from './screens/CurrentRun/CurrentRun';
import RunHistory from './screens/runhistory/RunHistory';
import Chat from './screens/chat/chat';
import Login from './screens/oldlogin/oldLogin';
import './amplify-config';
import Auth from './screens/Authentication/Auth';


const icons = {
  run: require('./assets/run.png'),
  metrics: require('./assets/metrics.png'),
  history: require('./assets/history.png'),
  chat: require('./assets/chat.png'),
}

export default function App() {
  const NavBar = createBottomTabNavigator();
  const [isLogged, setIsLogged] = useState(false);
  const screenOptions = { headerShown: false, tabBarShowLabel: false, tabBarStyle: { height: 100, paddingTop: 20 } }

  return (
    <ConnProvider>
      <RunProvider>
        <SafeAreaView style={{ flex: 1 }}>
          {isLogged ?
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
              </NavBar.Navigator>
            </NavigationContainer>
            // : <Login setIsLogged={setIsLogged} />}
            : <Auth setIsLogged={setIsLogged} />}
        </SafeAreaView>
      </RunProvider>
    </ConnProvider>
  );
}