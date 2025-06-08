import { StyleSheet, Text, View, SafeAreaView, TextInput, Switch, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { RadioButton, TouchableRipple } from 'react-native-paper';
import { ThemeContext } from '../../context/themeContext';
import { AntDesign, MaterialCommunityIcons, Ionicons  } from '@expo/vector-icons';
import { TimerSettingsContext } from '../../context/timerSettingsContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';
import { useRouter } from 'expo-router';

const Settings = () => {
  const { theme, setThemeMode, themeMode } = useContext(ThemeContext);
  const { setWorkInterval, setRestInterval, setSetCount, selectedSound, setSelectedSound } = useContext(TimerSettingsContext);
  const [modalOneVisible, setModalOneVisible] = useState(false);
  const [modalTwoVisible, setModalTwoVisible] = useState(false);
  const [modalThreeVisible, setModalThreeVisible] = useState(false);
  const [modalFourVisible, setModalFourVisible] = useState(false);
  const [modalFiveVisible, setModalFiveVisible] = useState(false);
  const [currentSound] = useState(null);
  const [sets, setSetsInput] = useState('');
  const router = useRouter();
  const [workHours, setWorkHours] = useState('');
  const [workMinutes, setWorkMinutes] = useState('');
  const [workSeconds, setWorkSeconds] = useState('');
  const [restHours, setRestHours] = useState('');
  const [restMinutes, setRestMinutes] = useState('');
  const [restSeconds, setRestSeconds] = useState('');

  const selectSound = (name) => {
  setSelectedSound(name);
  };

  useEffect(() => {
  return () => {
    if (currentSound) {
      currentSound.unloadAsync();
    }
  };
  }, [currentSound]);

  const handleSave = () => {
  const wH = parseFloat(workHours) || 0;
  const wM = parseFloat(workMinutes) || 0;
  const wS = parseFloat(workSeconds) || 0;
  const rH = parseFloat(restHours) || 0;
  const rM = parseFloat(restMinutes) || 0;
  const rS = parseFloat(restSeconds) || 0;
  const setCount = parseFloat(sets) || 0;

  if (
    !Number.isInteger(wH) || !Number.isInteger(wM) || !Number.isInteger(wS) ||
    !Number.isInteger(rH) || !Number.isInteger(rM) || !Number.isInteger(rS)
  ) {
    alert('Please enter whole numbers for hours, minutes, and seconds.');
    return;
  }

  if (
    wH > 23 || wH < 0 ||
    wM > 59 || wM < 0 ||
    wS > 59 || wS < 0 ||
    rH > 23 || rH < 0 ||
    rM > 59 || rM < 0 ||
    rS > 59 || rS < 0
  ) {
    alert('Please enter valid time values:\n- Hours: 1 to 23\n- Minutes: 1 to 59\n- Seconds: 1 to 59');
    return;
  }

  if ([workHours, workMinutes, workSeconds].some(val => val.includes('.') && parseFloat(val) === 0.5)) {
    alert('Work interval cannot be 0.5. Please enter whole numbers.');
    return;
  }
  if ([restHours, restMinutes, restSeconds].some(val => val.includes('.') && parseFloat(val) === 0.5)) {
    alert('Rest interval cannot be 0.5. Please enter whole numbers.');
    return;
  }

  if (sets.includes('.') && parseFloat(sets) === 0.5) {
    alert('Sets cannot be 0.5. Please enter a whole number.');
    return;
  }

  const workTotal = wH * 3600 + wM * 60 + wS;
  const restTotal = rH * 3600 + rM * 60 + rS;

  if (workTotal <= 0) {
    alert('Work interval must be greater than 0 seconds.');
    return;
  }

  if (restTotal <= 0) {
    alert('Rest interval must be greater than 0 seconds.');
    return;
  }

  if (setCount < 1 || setCount > 100 || !Number.isInteger(setCount)) {
    alert('Sets must be between 1 and 100.');
    return;
  }

  setWorkInterval(workTotal);
  setRestInterval(restTotal);
  setSetCount(setCount);

  setModalTwoVisible(false);
  setModalThreeVisible(false);
  setModalFourVisible(false);
  setModalFiveVisible(false);
};

  const handleLogout = async () => {
  try {
    await signOut(auth);
    router.replace('/sign-in');
  } catch (error) {
    console.error("Logout error:", error);
    alert("Failed to log out. Please try again.");
  }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.themelabelPosition}>
          <View style={styles.themelabelContainer}>
            <Text style={styles.label}>Theme</Text>
          </View>
        </View>
        <View style={styles.boxPosition}>
          <View style={[styles.themeContainer, { backgroundColor: theme.container }]}>
            <TouchableRipple onPress={() => setThemeMode('light')} style={styles.buttonBorder} rippleColor="transparent">
              <View style={styles.themeRow}>
                <MaterialCommunityIcons name="white-balance-sunny" size={24} style={styles.themeIcon1} />
                <Text style={[styles.themeText, { color: theme.text }]}>Light</Text>
                <View style={styles.buttonPosition}>
                  <RadioButton value="light" status={themeMode === 'light' ? 'checked' : 'unchecked'} onPress={() => setThemeMode('light')}/>
                </View>
              </View>
            </TouchableRipple>
            <View style={styles.line} />
            <TouchableRipple onPress={() => setThemeMode('dark')} style={styles.buttonBorder} rippleColor="transparent">
            <View style={styles.themeRow}>
              <Ionicons name="moon" size={23} style={[styles.themeIcon, { color: theme.text }]} />
              <Text style={[styles.themeText, { color: theme.text }]}>Dark</Text>
              <View style={styles.buttonPosition}>
                  <RadioButton value="dark" status={themeMode === 'dark' ? 'checked' : 'unchecked'} onPress={() => setThemeMode('dark')}/>
              </View>
            </View>
            </TouchableRipple>
          </View>
        </View>
        <View>
          <View style={styles.bsglabelPosition}>
              <View style={styles.themelabelContainer}>
                <Text style={styles.label1}>Ringtone</Text>
              </View>
          </View>
          <View style={styles.boxPosition}>
            <View style={[styles.bgsContainer, { backgroundColor: theme.container }]}>
              <View style={styles.themeRow}>
                <TouchableRipple rippleColor="transparent" onPress={() => setModalOneVisible(!modalOneVisible)}>
                  <Text style={[styles.bgsText, { color: theme.text }]}>{selectedSound || 'Default'}</Text>
                </TouchableRipple>
                <TouchableRipple style={styles.buttonPosition} rippleColor="transparent" onPress={() => setModalOneVisible(!modalOneVisible)}>
                  <View >
                    <AntDesign name="right" size={24} style={{ color: theme.text }} />
                  </View>
                </TouchableRipple>
              </View>
              <Modal animationType="none" transparent={true} visible={modalOneVisible} onRequestClose={() => {setModalOneVisible(!modalOneVisible);}}>
                <View style={styles.modalWrapper}>
                  <View style={[styles.modalposition1,  { backgroundColor: theme.modalbackground }]}>
                    <TouchableOpacity onPress={() => { selectSound('Default'); setModalOneVisible(false); }}>
                      <Text style={[styles.bgsText1, { color: theme.text }]}>Default</Text>
                    </TouchableOpacity>
                    <View style={styles.line} />
                    <TouchableOpacity onPress={() => { selectSound('Dawn'); setModalOneVisible(false); }}>
                      <Text style={[styles.bgsText1, { color: theme.text }]}>Dawn</Text>
                    </TouchableOpacity>
                    <View style={styles.line} />
                    <TouchableOpacity onPress={() => { selectSound('Alarm'); setModalOneVisible(false); }}>
                      <Text style={[styles.bgsText1, { color: theme.text }]}>Alarm</Text>
                    </TouchableOpacity>
                    <View style={styles.line} />
                    <TouchableOpacity onPress={() => { selectSound('Punk'); setModalOneVisible(false); }}>
                      <Text style={[styles.bgsText1, { color: theme.text }]}>Punk</Text>
                    </TouchableOpacity>
                    <View style={styles.line} />
                    <TouchableOpacity onPress={() => { selectSound('Reveille'); setModalOneVisible(false); }}>
                      <Text style={[styles.bgsText1, { color: theme.text }]}>Reveille</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </View>
        <View>
          <View style={styles.bsglabelPosition}>
            <View style={styles.themelabelContainer}>
              <Text style={styles.label1}>Custom Timer</Text>
            </View>
          </View>
          <View style={styles.boxPosition}>
            <View style={[styles.ctContainer, { backgroundColor: theme.container }]}>
              <View style={styles.themeRow}>
                <TouchableRipple rippleColor="transparent" onPress={() => setModalTwoVisible(!modalTwoVisible)}>
                  <Text style={[styles.bgsText, { color: theme.text }]}>Customize Time Interval</Text>
                </TouchableRipple>
                <TouchableRipple style={styles.buttonPosition} rippleColor="transparent" onPress={() => setModalTwoVisible(!modalTwoVisible)}>
                  <View >
                    <AntDesign name="right" size={24} style={{ color: theme.text }} />
                  </View>
                </TouchableRipple>
              </View>
              <Modal animationType='none' transparent={true} visible={modalTwoVisible} onRequestClose={() => {setModalTwoVisible(!modalTwoVisible);}}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalWrapper}>
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[styles.modalposition, { backgroundColor: theme.modalbackground }]}>
                      <View style={styles.modalcontainer}>
                        <TouchableOpacity style={[styles.interval, { backgroundColor: theme.modal}]} onPress={() => {setModalTwoVisible(false); setModalThreeVisible(true);}}>
                          <Text style={[styles.textSize, { color: theme.text }]}>Work Interval</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.interval, { backgroundColor: theme.modal}]} onPress={() => {setModalTwoVisible(false); setModalFourVisible(true);}}>
                          <Text style={[styles.textSize, { color: theme.text }]}>Rest Interval</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.interval, { backgroundColor: theme.modal}]} onPress={() => {setModalTwoVisible(false); setModalFiveVisible(true);}}>
                          <Text style={[styles.textSize, { color: theme.text }]}>Sets Interval</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.line1} />
                      <View style={styles.mbr}>
                        <TouchableOpacity style={styles.modalbutton} onPress={() => {setModalTwoVisible(false); setModalThreeVisible(false); setModalFourVisible(false); setModalFiveVisible(false);}}>
                          <Text style={[styles.mbf, { color: theme.text }]}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalbutton} onPress={handleSave}>
                          <Text style={[styles.mbf1, { color: theme.modalbutton }]}>SAVE</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
              </Modal>

              <Modal animationType='none' transparent={true} visible={modalThreeVisible} onRequestClose={() => {setModalThreeVisible(!modalThreeVisible);}}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalWrapper}>
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[styles.modalposition, { backgroundColor: theme.modalbackground }]}>
                      <View style={styles.modalcontainer}>
                        <Text style={[styles.textSize, { color: theme.text }]}>Enter Hours</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="0" value={workHours} onChangeText={setWorkHours}/>
                        <Text style={[styles.textMargin, { color: theme.text }]}>Enter Minutes</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="25" value={workMinutes} onChangeText={setWorkMinutes}/>
                        <Text style={[styles.textMargin, { color: theme.text }]}>Enter Seconds</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="0" value={workSeconds} onChangeText={setWorkSeconds}/>
                      </View>
                      <View style={styles.line1} />
                      <View style={styles.mbr}>
                        <TouchableOpacity style={styles.modalbutton} onPress={() => {setModalThreeVisible(false); setModalTwoVisible(true);}}>
                          <Text style={[styles.mbf, { color: theme.text }]}>BACK</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
              </Modal>

              <Modal animationType='none' transparent={true} visible={modalFourVisible} onRequestClose={() => {setModalFourVisible(!modalFourVisible);}}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalWrapper}>
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[styles.modalposition, { backgroundColor: theme.modalbackground }]}>
                      <View style={styles.modalcontainer}>
                        <Text style={[styles.textSize, { color: theme.text }]}>Enter Hours</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="0" value={restHours} onChangeText={setRestHours}/>
                        <Text style={[styles.textMargin, { color: theme.text }]}>Enter Minutes</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="5" value={restMinutes} onChangeText={setRestMinutes}/>
                        <Text style={[styles.textMargin, { color: theme.text }]}>Enter Seconds</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="0" value={restSeconds} onChangeText={setRestSeconds}/>
                      </View>
                      <View style={styles.line1} />
                      <View style={styles.mbr}>
                        <TouchableOpacity style={styles.modalbutton} onPress={() => {setModalThreeVisible(false); setModalTwoVisible(true);}}>
                          <Text style={[styles.mbf, { color: theme.text }]}>BACK</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
              </Modal>

              <Modal animationType='none' transparent={true} visible={modalFiveVisible} onRequestClose={() => {setModalFiveVisible(!modalFiveVisible);}}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalWrapper}>
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[styles.modalposition, { backgroundColor: theme.modalbackground }]}>
                      <View style={styles.modalcontainer}>
                        <Text style={[styles.textMargin, { color: theme.text }]}>Enter Sets</Text>
                        <TextInput style={styles.input1} keyboardType="numeric" placeholder="0" value={sets} onChangeText={setSetsInput}/>
                      </View>
                      <View style={styles.line1} />
                      <View style={styles.mbr}>
                        <TouchableOpacity style={styles.modalbutton} onPress={() => {setModalThreeVisible(false); setModalTwoVisible(true);}}>
                          <Text style={[styles.mbf, { color: theme.text }]}>BACK</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
              </Modal>

            </View>
          </View>
        </View>
        <View>
          <View style={styles.bsglabelPosition}>
            <View style={styles.themelabelContainer}>
              <Text style={styles.label1}>Account</Text>
            </View>
          </View>
          <View style={styles.boxPosition}>
            <TouchableRipple onPress={() => handleLogout()} rippleColor="transparent">
              <View style={[styles.adContainer, { backgroundColor: theme.container, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                <Text style={[styles.adText, { color: theme.text }]}>Logout</Text>
                <MaterialCommunityIcons name="logout" size={24} color={theme.text} />
              </View>
            </TouchableRipple>
          </View>
        </View>
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'gray',
  },
  themelabelPosition: {
    alignItems: 'center',
  },
  themelabelContainer: {
    width: '85%',
  },
  label: {
    color: 'gray',
    fontSize: 18,
  },
  label1: {
    color: 'gray',
    fontSize: 18,
  },
  boxPosition: {
    alignItems: 'center',
  },
  themeContainer: {
    borderColor: 'grey',
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    height: 105,
    paddingTop: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon1: {
    marginLeft: 10,
  },
  themeText: {
    marginLeft: 15.5,
    fontSize: 18,
  },
  buttonPosition: {
    flex: 1,
    alignItems: 'flex-end',
  },
  icon2: {
    height: 50,
    width: 50,
  },
  bsglabelPosition: {
    alignItems: 'center',
    marginTop: 15,
  },
  bgsContainer: {
    borderColor: 'grey',
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    height: 55,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  bgsText: {
    fontSize: 18,
  },
  ctContainer: {
    borderColor: 'grey',
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    height: 55,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    borderRadius: 10,
    backgroundColor: '#fcfdfd',
    height: 40
  },
  input1: {
    borderRadius: 10,
    backgroundColor: '#fcfdfd',
    marginBottom: 138,
    height: 40
  },
  textSize: {
    fontSize: 18,
  },
  textMargin: {
    marginTop: 18,
    fontSize: 18,
  },
  adContainer: {
    borderColor: 'grey',
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    borderRadius: 20,
    height: 55,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  adText: {
    fontSize: 18,
  },
  buttonBorder: {
    borderRadius: 20,
  },
  modalposition: {
  width: '90%',
  borderRadius: 20,
  elevation: 10,
  },
  modalcontainer: {
    padding: 20,
  },
  mbr: {
    flexDirection: 'row',
  },
  themeIcon: {
    marginLeft: 10
  },
  modalbutton: {
    height: 55.5,
    width: 161.5,
  },
  mbf: {
    fontSize: 22,
    textAlign: 'center',
    padding: 10,
  },
  mbf1: {
    fontSize: 22,
    textAlign: 'center',
    padding: 10,
  },
  line1: {
    marginTop: 10,
    width: '100%',
    height: 1,
    backgroundColor: 'gray',
  },
  modalWrapper: {
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingBottom: 100,
  },
  modalposition1: {
    width: '90%',
    height: 250,
    borderRadius: 20,
  },
  bgsText1: {
    fontSize: 22,
    padding: 10,
  },
  themeIcon1: {
    marginLeft: 10,
    color: 'orange',
  },
  interval: {
    padding: 14,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center'
  },
})