import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../context/themeContext';
import { AntDesign, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../../FirebaseConfig';
import { collection, getDocs, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const Home = () => {
  const { theme } = useContext(ThemeContext);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [taskCompletedCount, setTaskCompletedCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [activityTimeline, setActivityTimeline] = useState([]);

  const getTodayFocusTime = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startTimestamp = Timestamp.fromDate(startOfDay);

    const sessionsRef = collection(db, 'users', user.uid, 'focusSessions');
    const q = query(sessionsRef, where('timestamp', '>=', startTimestamp));

    const querySnapshot = await getDocs(q);

    let totalSeconds = 0;
    querySnapshot.forEach(doc => {
      const data = doc.data();
      totalSeconds += data.duration;
    });

    setTotalFocusTime(totalSeconds);
  } catch (error) {
    console.error("Error fetching today's focus time:", error);
  }
  };

  const getTodayCompletedTasks = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startTimestamp = Timestamp.fromDate(startOfDay);

    const taskRef = collection(db, 'users', user.uid, 'completedTasks');
    const q = query(taskRef, where('timestamp', '>=', startTimestamp));
    const querySnapshot = await getDocs(q);

    setTaskCompletedCount(querySnapshot.size);
  } catch (error) {
    console.error("Error fetching task completions:", error);
  }
  };

  const getStreak = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = collection(db, 'users', user.uid, 'completedTasks');
    const querySnapshot = await getDocs(taskRef);

    const dateSet = new Set();

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const date = data.timestamp.toDate();
      const dateString = date.toISOString().split('T')[0];
      dateSet.add(dateString);
    });

    const sortedDates = Array.from(dateSet).sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < sortedDates.length; i++) {
      const streakDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((currentDate - streakDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (diffDays === 1) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStreakCount(streak);
  } catch (error) {
    console.error("Error calculating streak:", error);
  }
  };

  useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  const tasksRef = collection(db, 'users', user.uid, 'completedTasks');
  const q = query(tasksRef, orderBy('timestamp', 'desc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const timelineData = snapshot.docs.map(doc => doc.data());
    setActivityTimeline(timelineData);
  }, (error) => {
    console.error('Failed to listen to timeline updates:', error);
  });

  return () => unsubscribe();
}, []);

  useFocusEffect(
  useCallback(() => {
    getTodayFocusTime();
  }, [])
  );

  useFocusEffect(
  useCallback(() => {
    getTodayFocusTime();
    getTodayCompletedTasks();
    getStreak()
  }, [])
  );

  const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};




  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.titlePage}>
        <Text style={styles.titleFont}>Daily Report</Text>
      </View>

      <View style={[styles.containerPosition, {backgroundColor: theme.container}]}>
        <View>
          <View style={styles.row}>
            <Text style={styles.ctFont}>Total Focus Time</Text>
            <AntDesign name="clockcircle" size={20} style={[styles.icons, {color: theme.text} ]} />
          </View>
          <Text style={[styles.cFont, {color: theme.text}]}>{Math.floor(totalFocusTime / 3600)}h {Math.floor((totalFocusTime % 3600) / 60)}m {totalFocusTime % 60}s</Text>
        </View>
      </View>
      
      <View style={[styles.containerPosition, {backgroundColor: theme.container}]}>
        <View>
          <View style={styles.row}>
            <Text style={styles.ctFont}>Task Completed</Text>
            <FontAwesome name="check" size={25} style={styles.iconcheck}/>
          </View>
          <Text style={[styles.cFont, {color: theme.text}]}>{taskCompletedCount}</Text>
        </View>
      </View>

      <View style={[styles.containerPosition, {backgroundColor: theme.container}]}>
        <View>
          <View style={styles.row}>
            <Text style={styles.ctFont}>Streak</Text>
            <MaterialCommunityIcons name="fire" size={25} style={styles.iconfire}/>
          </View>
          <Text style={[styles.cFont, {color: theme.text}]}>{streakCount} {streakCount === 1 ? 'day' : 'days'}</Text>
        </View>
      </View>

      <View style={styles.timelineScrollWrapper}>
  <ScrollView
    showsVerticalScrollIndicator={false}
  >
    {activityTimeline.map((item, index) => {
      const date = item.timestamp.toDate();
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

      return (
        <View
  key={index}
  style={[
    styles.timelineCard,
    {
      backgroundColor: theme.container,
      borderColor: theme.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  ]}
>
  <View style={styles.leftSection}>
    <Text style={[styles.timelineTitle, { color: theme.text }]}>
      {item.title || 'Untitled Study'}
    </Text>
    <Text style={[styles.timelineText, { color: theme.text }]}>
      Date: {dateStr}
    </Text>
  </View>
  <View style={styles.rightSection}>
    <Text style={[styles.timelineText, { color: theme.text }]}>
      {formatDuration(item.totalTimeSpent || 0)}
    </Text>
    <Text style={[styles.timelineText, { color: theme.text }]}>
      {timeStr}
    </Text>
  </View>
</View>
      );
    })}
    <View style={{ height: 100 }} />
  </ScrollView>
</View>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  titlePage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleFont: {
    color: 'grey',
    marginTop: 20,
    fontSize: 28.5,
    fontWeight: 'bold',
  },
  containerPosition: {
    marginTop: 20,
    backgroundColor: 'white',
    display: 'flex',
    width: '90%',
    borderRadius: 20,
    height: 100,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  ctFont: {
    fontSize: 20,
    fontWeight: '400',
    color: 'grey',
  },
  cFont: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    marginLeft: 10,
  },
  iconfire: {
    marginLeft: 10,
    color: 'red',
  },
  iconcheck: {
    marginLeft: 10,
    color: 'green',
  },

  timelineScrollWrapper: {
  height: 170,
  width: '90%',
  marginTop: 10,
},
  sectionTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 8,
},

timelineCard: {
  padding: 14,
  borderRadius: 12,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 2,
},

timelineTitle: {
  fontSize: 16,
  fontWeight: '600',
},

timelineText: {
  fontSize: 14,
  marginTop: 4,
},
leftSection: {
  flex: 1,
  justifyContent: 'center',
},

rightSection: {
  alignItems: 'flex-end',
  justifyContent: 'center',
},
})