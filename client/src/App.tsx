import { StatusBar, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Providers } from '@context';
import { MainApp } from '@components';
import '../amplify-config';

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