import { StatusBar, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../amplify-config';
import { Providers } from './context/Providers';
import { MainApp } from './components/MainApp/MainApp';

export default function App() {
  return (
    <Providers>
      <SafeAreaView style={{ flex: 1, paddingTop: 10 }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <MainApp />
      </SafeAreaView>
    </Providers>
  );
}