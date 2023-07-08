import { SafeAreaView, View } from 'react-native';
import { Stack } from 'expo-router';
import HoursCard from '../../src/components/home/HoursCard';
import tw from '../../src/helpers/tailwind';

export default function BuildingHours() {
    return (
        <SafeAreaView>
            <View style={tw('p-3')}>
                <HoursCard/>
            </View>
        </SafeAreaView>
    );
}