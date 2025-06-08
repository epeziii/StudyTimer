import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Pressable} from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { auth } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';

const SignUp = () => {
  const [secureText, setSecureText] = useState(true);
  const [modalOneVisible, setModalOneVisible] = useState(false);
  const [modalTwoVisible, setModalTwoVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const signUp = async () => {
  const emailIsValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordIsValid =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);

  if (!emailIsValid) {
    alert('Please enter a valid email address.');
    return;
  }

  if (!passwordIsValid) {
    alert(
      'Password must be at least 8 characters long, contain at least one uppercase letter, and one special character.',
    );
    return;
  }

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await sendEmailVerification(user); // send verification email
    await signOut(auth); // log user out after signup
    alert('Account created. Please check your email to verify your account.');
    router.replace('/sign-in');
  } catch (error) {
    console.log(error);
    alert('Sign-up failed: ' + error.message);
  }
  };



  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.text1}>Create new{'\n'}Account</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}/>
        <View style={styles.passwordContainer}>
          <TextInput style={styles.passwordInput} placeholder="Password" secureTextEntry={secureText} value={password} onChangeText={setPassword}/>
          <TouchableOpacity onPress={toggleSecureText}>
            <Icon name={secureText ? 'eye' : 'eye-off'} size={24} color="gray"/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button1} onPress={signUp}>
          <Text style={styles.text2}>Sign up</Text>
        </TouchableOpacity>
        <View style={styles.Vlink}>
          <Text>Already Registered? </Text>
          <Link href="/sign-in" style={styles.link}>Login in here.</Link>
        </View>
        <View style={styles.Vlink}>
          <Pressable onPress={() => setModalOneVisible(!modalOneVisible)} style={styles.link}>
            <Text style={styles.link}>Terms of Use</Text>
          </Pressable>
          <Text> . </Text>
          <Pressable onPress={() => setModalTwoVisible(!modalOneVisible)} style={styles.link}>
            <Text style={styles.link}>Privacy Policy</Text>
          </Pressable>
        </View>
        <Modal animationType="none" transparent={true} visible={modalOneVisible} onRequestClose={() => {setModalOneVisible(!modalOneVisible);}}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalposition1}>
              <Text style={styles.title}>Terms of Use</Text>
              <Text>1. Acceptance of Terms By creating an account and using our service, you agree to comply with and be bound by these Terms and Conditions.</Text>
              <Text>2. User Responsibilities You are responsible for maintaining the confidentiality of your account and password, and for all activities that occur under your account.</Text>
              <Text>3. Use of Service You agree to use the service only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment.</Text>
              <Text>4. Intellectual Property All content, trademarks, and data on this service are owned by or licensed to us and are protected by applicable laws.</Text>
              <Text>5. Termination We reserve the right to suspend or terminate your account at our discretion if you violate these terms.</Text>
              <Text>6. Limitation of Liability We provide the service "as is" without warranties. We are not liable for any damages arising from your use of the service.</Text>
              <Text>7. Changes to Terms We may update these Terms and Conditions at any time. Continued use of the service means you accept those changes.</Text>
              <Text>8. Contact If you have any questions about this Privacy Policy, please contact us at [your email/contact info].</Text>
              <View style={styles.bbe}>
                <TouchableOpacity style={styles.backbutton} onPress={() => {setModalOneVisible(!modalOneVisible)}}>
                  <Text style={styles.bbt}>Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal animationType="none" transparent={true} visible={modalTwoVisible} onRequestClose={() => {setModalTwoVisible(!modalTwoVisible);}}>
          <View style={styles.modalWrapper1}>
            <View style={styles.modalposition1}>
              <Text style={styles.title}>Privacy Policy</Text>
              <Text>1. Information We Collect We collect personal information you provide during sign up, such as your name, email address, and any other data you choose to share.</Text>
              <Text>2. How We Use Your Information Your information is used to provide, maintain, and improve our services, communicate with you, and for security purposes.</Text>
              <Text>3. Data Sharing and Disclosure We do not sell or rent your personal information to third parties. We may share data with trusted partners to help operate the service but only under strict confidentiality.</Text>
              <Text>4. Data Security We implement reasonable security measures to protect your data from unauthorized access or disclosure.</Text>
              <Text>5. Your Rights You have the right to access, update, or delete your personal information. You may also opt out of promotional communications.</Text>
              <Text>6. Cookies and Tracking We may use cookies and similar technologies to enhance your experience. You can control cookie preferences via your browser settings.</Text>
              <Text>7. Changes to Privacy Policy We may update this Privacy Policy occasionally. Continued use of the service means you accept any changes.</Text>
              <Text>8. Contact If you have any questions about this Privacy Policy, please contact us at [your email/contact info].</Text>
              <View style={styles.bbe}>
                <TouchableOpacity style={styles.backbutton} onPress={() => {setModalTwoVisible(!modalTwoVisible)}}>
                  <Text style={styles.bbt}>Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text1: {
    marginBottom: 30,
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    paddingLeft: 15,
    marginTop: 20,
    borderWidth: 1,
    width: 300,
    height: 50,
    fontSize: 20,
    borderRadius: 20,
  },
  passwordContainer: {
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  text2: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  link: {
    fontSize: 15,
    color: 'blue'
  },
  modalposition1: {
    width: '90%',
    height: '90%',
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'lightgrey',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  modalWrapper1: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  Vlink: {
    marginTop: 25,
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  backbutton: {
    borderRadius: 20,
    padding: 10,
    width: 100,
    backgroundColor: 'black',
    alignItems: 'center'
  },
  bbt: {
    color: 'white',
  },
  bbe: {
    alignItems: 'flex-end',
  },
});
