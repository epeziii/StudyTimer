import React, { useContext } from 'react';
import { Tabs } from 'expo-router';
import { icons } from '../../constants';
import { ThemeContext, ThemeProvider } from '../../context/themeContext';
import { TimerSettingsProvider } from '../../context/timerSettingsContext';
import { View, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TabIcon = ({ icon, focused }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={{ paddingTop: 5 }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{ width: 24, height: 24, tintColor: focused ? 'blue' : 'gray' }}
      />
    </View>
  );
};

const TabsLayout = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          color: theme.tabText,
          paddingTop: 5,
        },
        tabBarStyle: {
        position: 'absolute',
        bottom: 10,
        left: '5%',
        right: '5%',
        height: 60,
        backgroundColor: theme.tabBackground,
        borderRadius: 30,
        borderTopWidth: 0,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        },

      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Timer"
        options={{
          title: 'Pomodoro',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="timer-outline"
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.settings} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

const AppLayout = () => (
  <ThemeProvider>
    <TimerSettingsProvider>
      <TabsLayout />
    </TimerSettingsProvider>
  </ThemeProvider>
);

export default AppLayout;

const styles = StyleSheet.create({});
