import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import PaginationDots from '../components/PaginationDots';

const Onboarding1 = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.container1}>
            <Text style={styles.text1}>Get started</Text>
            <Text style={styles.text2}>Log in to set up your study{'\n'}timer and start your{'\n'}productive learning sessions</Text>
            <TouchableOpacity style={styles.button1} onPress={() => router.push('/sign-in')}>
                <Text style={styles.buttontext1}>Log in</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.margin}>
            <PaginationDots currentIndex={2} />
        </View>
    </SafeAreaView>
  )
}

export default Onboarding1

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container1: {
        alignItems: 'center',
    },
    text1: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    text2: {
        fontSize: 20,
        color: 'gray',
    },
    button1: {
        marginTop: 40,
        borderRadius: 20,
        backgroundColor: 'black',
        padding: 10,
        width: 300,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    buttontext1: {
        color: 'white',
        fontSize: 25,
    },
    margin: {
        marginTop: 30
    }
})
