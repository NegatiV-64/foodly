import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Colors } from './src/styles/colors';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Router } from './src/screens/_router';

const theme = {
  ...DefaultTheme,
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Router />
        <StatusBar style="dark" backgroundColor={Colors.amber[500]} />
      </NavigationContainer>
    </PaperProvider>
  );
}