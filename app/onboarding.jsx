import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import { images } from '../constants'
import { router } from 'expo-router'
import PaginationDots from '../components/PaginationDots';

const Onboarding = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View>
            <Image source={images.session} style={styles.image1} resizeMode='contain'/>
            <Text style={styles.text1}>Track Study{'\n'}Progress</Text>
            <Text style={styles.text2} >Review your completed{'\n'}sessions to monitor your{'\n'}study progress overtime</Text>
            <View style={styles.container2}>
                <TouchableOpacity style={styles.button1} onPress={() => router.back('/index')}>
                    <View>
                        <Text style={styles.buttontext1}>Back</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button2} onPress={() => router.push('/onboarding1')}>
                    <View>
                        <Text style={styles.buttontext2}>Next</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <PaginationDots currentIndex={1} />
        </View>
    </SafeAreaView>
  )
}

export default Onboarding

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image1: {
        width: 330,
        height: 330,
    },
    text1: {
        marginTop: 30,
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'verdana',
    },
    text2: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 20,
        color: 'gray',
    },
    container2: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    button1: {
        backgroundColor: 'white',
        padding: 8,
        marginRight: 20,
        width: 160,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    button2: {
        backgroundColor: 'black',
        borderWidth: 1,
        padding: 8,
        width: 160,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    buttontext1: {
        textAlign: 'center',
        fontSize: 25,
    },
    buttontext2: {
        color: 'white',
        textAlign: 'center',
        fontSize: 25,
    },
})
