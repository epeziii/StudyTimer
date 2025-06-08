import { StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { images } from '../constants';
import PaginationDots from '../components/PaginationDots';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container1}>
                <View style={styles.container2}>
                    <Image source={images.clock} style={styles.image1} />
                    <Text style={styles.text1}>StudyTimer</Text>
                </View>
                <Image source={images.timer} style={styles.image2} resizeMode='contain'/>
                <Text style={styles.text2}>Efficient Study Sessions</Text>
                <Text style={styles.text3}>Utilize a timer to stay focused and{'\n'}maintain productivity while Studying.</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/onboarding')}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
                <PaginationDots currentIndex={0} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container1: {
        alignItems: 'center',
    },
    container2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image1: {
        width: 70,
        height: 70,
    },
    text1: {
        fontWeight: 'bold',
        fontSize: 40,
        fontFamily: 'verdana',
        marginLeft: 10,
    },
    image2: {
        width: 330,
        height: 330,
        marginTop: 30,
    },
    text2: {
        marginTop: 30,
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'verdana',
    },
    text3: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 20,
        color: 'gray',
    },
    button: {
        marginTop: 20,
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
    buttonText: {
        color: 'white',
        fontSize: 25,
    }
});
