import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { auth } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const SignIn = () => {
  const [secureText, setSecureText] = useState(true);
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');

  const signIn = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      Alert.alert(
        'Email Not Verified',
        'Please verify your email address before logging in.'
      );
      await auth.signOut(); // prevent access if not verified
      return;
    }

    router.replace('/(tabs)/home'); // go to home if verified
  } catch (error) {
    console.log(error);
    alert('Sign in failed: ' + error.message);
  }
  };

  const handleForgotPassword = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Email Sent', 'Password reset email has been sent.');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.text1}>Welcome to{'\n'}StudyTimer</Text>        
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <View style={styles.inputContainer}>
          <TextInput style={styles.passwordInput} placeholder="Password" secureTextEntry={secureText} value={password} onChangeText={setPassword}/>
          <TouchableOpacity onPress={toggleSecureText}>
            <Icon name={secureText ? 'eye' : 'eye-off'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button1} onPress={signIn}>
          <Text style={styles.text2}>Sign in</Text>
        </TouchableOpacity>

        {/* Now tappable Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.fp}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.line} />
        <TouchableOpacity style={styles.button2} onPress={() => router.push('/sign-up')}>
          <Text style={styles.text2}>Sign Up</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    paddingLeft: 15,
    marginTop: 80,
    borderWidth: 1,
    width: 300,
    height: 50,
    fontSize: 20,
    borderRadius: 20,
  },
  inputContainer: {
    marginTop: 20,
    borderWidth: 1,
    width: 300,
    height: 50,
    borderRadius: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    fontSize: 20,
  },
  button1: {
    marginTop: 30,
    width: 300,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  text2: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  link: {
    marginTop: 30,
    fontSize: 15,
  },
  fp: {
    marginTop: 20,
    color: 'blue'
  },  
  line: {
    marginTop: 20,
    width: '80%',
    height: 1,
    backgroundColor: 'gray',
  },
  button2: {
    marginTop: 10,
    width: 300,
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});
