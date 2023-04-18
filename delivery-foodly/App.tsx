import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Colors } from './src/styles/colors';
import type { MD3Theme} from 'react-native-paper';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Router } from './src/screens/_router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/contexts/auth/auth.context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  }
});

const theme: MD3Theme = {
  ...DefaultTheme,
};

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Router />
            <StatusBar style="dark" backgroundColor={Colors.amber[500]} />
          </NavigationContainer>
        </PaperProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}