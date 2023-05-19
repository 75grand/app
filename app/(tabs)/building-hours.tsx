import { SafeAreaView, View } from 'react-native';
import { Stack } from 'expo-router';
import HoursCard from '../../components/home/HoursCard';
import tw from '../../lib/tailwind';

export default function BuildingHours() {
    return (
        <SafeAreaView>
            <View style={tw('p-3')}>
                <HoursCard/>
            </View>
        </SafeAreaView>
    );
}