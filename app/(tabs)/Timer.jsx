import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { useState, useEffect, useContext, useRef } from 'react';
import { ThemeContext } from '../../context/themeContext';
import ProgressRing from '../../components/ProgressRing';
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { TimerSettingsContext } from '../../context/timerSettingsContext';
import { db, auth } from "../../FirebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Audio } from 'expo-av';

const Timer = () => {
  const { theme } = useContext(ThemeContext);
  const { workInterval, restInterval, setCount } = useContext(TimerSettingsContext);
  const [setsLeft, setSetsLeft] = useState(setCount);
  const [secondsLeft, setSecondsLeft] = useState(workInterval);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [studyTitle, setStudyTitle] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const { selectedSound } = useContext(TimerSettingsContext);
  const soundRef = useRef(null);
  const timeSpentRef = useRef(timeSpent);
  const [isSessionComplete, setIsSessionComplete] = useState(false);  
  const [modalVisible, setModalVisible] = useState(false);
  const [inputTitle, setInputTitle] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingResponse, setLoadingResponse] = useState(false);

  const generateReviewer = async () => {
  setLoadingResponse(true);
  setAiResponse('');
  try {
    const response = await fetch('http://192.168.241.47:8000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: `What is "${inputTitle}"?` }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    let generatedText = data.generated_text || 'No response generated.';

    const promptPrefix = `What is "${inputTitle}"?`;
    if (generatedText.startsWith(promptPrefix)) {
      generatedText = generatedText.slice(promptPrefix.length).trim();
    }

    setAiResponse(generatedText);
  } catch (error) {
    console.error('Error fetching AI response:', error);
    setAiResponse('Something went wrong generating the reviewer.');
  } finally {
    setLoadingResponse(false);
  }
  };

  useEffect(() => {
    setSecondsLeft(workInterval);
    setSetsLeft(setCount);
    setMode('work');
    setIsRunning(false);
    setTimeSpent(0);
    setIsSessionComplete(false);
  }, [workInterval, restInterval, setCount]);

  useEffect(() => {
    timeSpentRef.current = timeSpent;
  }, [timeSpent]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        setTimeSpent(prevTime => {
          const newTime = prevTime + 1;
          timeSpentRef.current = newTime;
          return newTime;
        });

        if (prev === 1) {
          if (mode === 'work') {
            void logFocusSession(timeSpentRef.current);
            setMode('break');
            return restInterval;
          }

          if (mode === 'break') {
            if (setsLeft > 1) {
              setSetsLeft(prevSets => prevSets - 1);
              setMode('work');
              return workInterval;
            } else {
              setSetsLeft(0);
              setIsSessionComplete(true);
              setIsRunning(false);
              void logCompletedTask();
              void playRingtone();
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, setsLeft, workInterval, restInterval]);

  const logCompletedTask = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const sessionData = {
        completed: true,
        timestamp: Timestamp.now(),
        title: studyTitle || 'Untitled',
        totalTimeSpent: timeSpent,
      };
      await addDoc(collection(db, 'users', user.uid, 'completedTasks'), sessionData);
      setTimeSpent(0);
    } catch (error) {
      console.error('Error logging completed task:', error);
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes.toString()}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${seconds}`;
    }
  };

  const handleStartPause = () => {
    if (isSessionComplete) {
      setMode('work');
      setSecondsLeft(workInterval);
      setSetsLeft(setCount);
      setTimeSpent(0);
      setIsSessionComplete(false);
      setIsRunning(true);
      return;
    }

    if (secondsLeft === 0) {
      setSecondsLeft(mode === 'work' ? workInterval : restInterval);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    stopRingtone();

    setIsRunning(false);
    setMode('work');
    setSetsLeft(setCount);
    setSecondsLeft(workInterval);
    setTimeSpent(0);
    setIsSessionComplete(false);
  };

  const logFocusSession = async (duration) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, 'users', user.uid, 'focusSessions'), {
        duration,
        timestamp: Timestamp.now()
      });
    } catch (error) {
      console.error("Error logging focus session:", error);
    }
  };

  const playRingtone = async () => {
    let soundFile = null;

    switch (selectedSound) {
      case 'Dawn':
        soundFile = require('../../assets/sounds/dawn.mp3');
        break;
      case 'Alarm':
        soundFile = require('../../assets/sounds/alarm.mp3');
        break;
      case 'Punk':
        soundFile = require('../../assets/sounds/punk.mp3');
        break;
      case 'Reveille':
        soundFile = require('../../assets/sounds/reveille.mp3');
        break;
      default:
        return;
    }

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(soundFile);
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing ringtone:', error);
    }
  };

  const stopRingtone = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.error('Error stopping ringtone:', error);
      }
      soundRef.current = null;
    }
  };

  const totalTime = mode === 'work' ? workInterval : restInterval;
  const progress = totalTime === 0 ? 0 : (totalTime - secondsLeft) / totalTime;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{mode === 'work' ? 'Study Time!' : 'Break Time!'}</Text>

      <View style={styles.timerWrapper}>
        <ProgressRing radius={130} strokeWidth={18} progress={progress} color="#1d7eaa" backgroundColor="#ccc" isBreak={mode === 'break'}/>
        <View style={styles.absoluteCenter}>
          <Text style={[styles.timerText, { color: theme.text }]}>{formatTime(secondsLeft)}</Text>
        </View>
      </View>
      <Text style={{ color: theme.text, fontSize: 25, marginBottom: 20 }}>Sets left: {setsLeft}</Text>

      <TextInput placeholder="What is the Title of your study?" style={styles.TextInput1} value={studyTitle} onChangeText={(text) => {setStudyTitle(text); setInputTitle(text);}} />
      <TouchableOpacity
        style={{
          width: 200,
          backgroundColor: '#1d7eaa',
          padding: 10,
          borderRadius: 8,
          marginHorizontal: 30
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Open Reviewer</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{
            margin: 20,
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5
          }}>
            {loadingResponse ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <ScrollView style={{ maxHeight: 300 }}>
                <Text style={{ color: '#333' }}>{aiResponse}</Text>
              </ScrollView>
            )}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: '#dc3545',
                padding: 10,
                borderRadius: 5,
                marginTop: 10
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.row}>
        <TouchableOpacity style={styles.redo} onPress={handleReset}>
          <EvilIcons name="redo" size={70} style={{ color: theme.text }} />
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => {handleStartPause(); generateReviewer();}}>
            <Ionicons name={isRunning ? 'pause-circle' : 'play-circle'} size={75} color="#1d7eaa"/>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Timer;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  TextInput1: {
    height: 40,
    width: 205,
    textAlign: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: '#fcfdfd',
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    color: '#111',
  },
  timerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  absoluteCenter: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 60,
    fontWeight: '700',
    color: 'black',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -37.5 }],
  },
  redo: { 
    position: 'absolute',
    left: '5%'
  },
  row: {
    flexDirection: 'row',
    paddingTop: 160,
    width: '90%',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
});