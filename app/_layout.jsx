import {  Stack } from 'expo-router'
import { TimerSettingsProvider } from '../context/timerSettingsContext';

const RootLayout = () => {
  return (
    <TimerSettingsProvider>
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false}}/>
        <Stack.Screen name="onboarding" options={{ headerShown: false}}/>
        <Stack.Screen name="onboarding1" options={{ headerShown: false}}/>
        <Stack.Screen name="(auth)" options={{ headerShown: false}}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false}}/>
    </Stack>
    </TimerSettingsProvider>
  )
}

export default RootLayout
