import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName='(tabs)'>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Group" options={{ headerShown: false }} />
        <Stack.Screen name="Transaction" options={{ headerShown: false }} />
        <Stack.Screen name="TransactionDetail" options={{ headerShown: false }} />
        <Stack.Screen name="TransactionsTypes.js/Expense" />
        <Stack.Screen name="TransactionsTypes.js/Income" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
