import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Switch } from 'react-native';
import { Audio } from 'expo-av';
import { db } from '@/constants/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useDarkMode } from '@/context/DarkModeContext';

const Settings = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('@/assets/sounds/white-noise.mp3'));
    setSound(sound);
    await sound.playAsync();
  };

  const getStudyStreak = async () => {
    const q = query(
      collection(db, 'studySessions'),
      where('timestamp', '>=', new Date(new Date().setDate(new Date().getDate() - 1)))
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <Text style={[styles.header, darkMode && styles.darkText]}>Settings</Text>
      <View style={styles.switchContainer}>
        <Text style={darkMode && styles.darkText}>Focus Mode</Text>
        <Switch value={isFocusMode} onValueChange={setIsFocusMode} />
      </View>
      <View style={styles.switchContainer}>
        <Text style={darkMode && styles.darkText}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
      <Button title="Play Background Sound" onPress={playSound} />
      <Button title="Get Study Streak" onPress={getStudyStreak} />
    </View>
  );
};

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
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default Settings;