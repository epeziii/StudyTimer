import React from 'react';
import { View, StyleSheet } from 'react-native';
import PomodoroTimer from '@/components/PomodoroTimer';
import { useDarkMode } from '@/context/DarkModeContext';

export default function HomeScreen() {
  const { darkMode } = useDarkMode();

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <PomodoroTimer darkMode={darkMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
});