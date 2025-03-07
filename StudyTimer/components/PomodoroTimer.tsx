import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Svg, { Circle, Line } from 'react-native-svg';
import { db } from '@/constants/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const PomodoroTimer = ({ darkMode }) => {
  const [task, setTask] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const minutesRef = useRef(null);
  const secondsRef = useRef(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            setIsRunning(false);
            saveStudySession();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, minutes, seconds]);

  const startTimer = () => setIsRunning(true);

  const stopTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setMinutes(0);
    setSeconds(0);
    setIsRunning(false);
  };

  const saveStudySession = async () => {
    try {
      await addDoc(collection(db, 'studySessions'), {
        task,
        duration: minutes,
        timestamp: new Date(),
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={[styles.itemText, darkMode && styles.darkText]}>{item}</Text>
    </View>
  );

  const generateNumbers = (max) => {
    return Array.from({ length: max + 1 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
  };

  const generateInfiniteNumbers = (max) => {
    const numbers = generateNumbers(max);
    return [...numbers, ...numbers, ...numbers];
  };

  const handleScrollEnd = (e, setIndex, max, ref) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / 50) % (max + 1);
    setIndex(index);
    ref.current.scrollToOffset({ offset: index * 50, animated: false });
  };

  const initialScrollIndex = 60; // Start from the middle of the infinite list

  const renderAnalogTimer = () => {
    const radius = 100;
    const centerX = 120;
    const centerY = 120;
    const minuteAngle = (minutes / 60) * 360;
    const secondAngle = (seconds / 60) * 360;

    return (
      <Svg height="240" width="240" viewBox="0 0 240 240">
        <Circle cx={centerX} cy={centerY} r={radius} stroke="black" strokeWidth="2.5" fill="none" />
        <Line
          x1={centerX}
          y1={centerY}
          x2={centerX + radius * Math.sin((minuteAngle * Math.PI) / 180)}
          y2={centerY - radius * Math.cos((minuteAngle * Math.PI) / 180)}
          stroke="black"
          strokeWidth="2.5"
        />
        <Line
          x1={centerX}
          y1={centerY}
          x2={centerX + radius * Math.sin((secondAngle * Math.PI) / 180)}
          y2={centerY - radius * Math.cos((secondAngle * Math.PI) / 180)}
          stroke="red"
          strokeWidth="1.5"
        />
      </Svg>
    );
  };

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      {isRunning && (
        <View style={styles.analogTimerContainer}>
          {renderAnalogTimer()}
          <Text style={[styles.digitalTimer, darkMode && styles.darkText]}>
            {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
          </Text>
        </View>
      )}
      {!isRunning && (
        <View style={styles.timerContainer}>
          <FlatList
            ref={minutesRef}
            data={generateInfiniteNumbers(59)}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item}-${index}`}
            showsVerticalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={50}
            decelerationRate="fast"
            initialScrollIndex={60}
            getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
            onMomentumScrollEnd={(e) => handleScrollEnd(e, setMinutes, 59, minutesRef)}
            style={styles.scroll}
            initialNumToRender={3}
          />
          <Text style={[styles.separator, darkMode && styles.darkText]}>:</Text>
          <FlatList
            ref={secondsRef}
            data={generateInfiniteNumbers(59)}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item}-${index}`}
            showsVerticalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={50}
            decelerationRate="fast"
            initialScrollIndex={60}
            getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
            onMomentumScrollEnd={(e) => handleScrollEnd(e, setSeconds, 59, secondsRef)}
            style={styles.scroll}
            initialNumToRender={3}
          />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={resetTimer} style={[styles.iconButton, styles.resetButton]}>
          <Icon name="repeat" size={30} color={darkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={isRunning ? stopTimer : startTimer} style={styles.iconButton}>
          <Icon name={isRunning ? 'pause' : 'play'} size={30} color={darkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, darkMode && styles.darkInput]}
        placeholder="What are you studying?"
        placeholderTextColor={darkMode ? '#ccc' : '#000'}
        value={task}
        onChangeText={setTask}
      />
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  analogTimerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scroll: {
    height: 150,
    marginHorizontal: 20, // Increase horizontal margin for more spacing
  },
  item: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 48,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  separator: {
    fontSize: 48,
    marginHorizontal: 10,
    color: '#000',
  },
  digitalTimer: {
    fontSize: 48,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 80, // Adjust this value to position the button near the nav bar but not too close
    justifyContent: 'center',
    width: '100%',
  },
  iconButton: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  resetButton: {
    position: 'absolute',
    left: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    width: '80%',
    color: '#000',
  },
  darkInput: {
    borderColor: '#ccc',
    color: '#fff',
  },
});

export default PomodoroTimer;