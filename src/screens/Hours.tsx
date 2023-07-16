import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import HoursCard from '../components/home/HoursCard';
import Grid from '../components/Grid';
import { SafeAreaView, ScrollView } from 'react-native';
import tw from '../helpers/tailwind';

export const screenOptions: NativeStackNavigationOptions = {
    title: 'Campus Hours'
}

export default function Hours() {
    return (
        <SafeAreaView>
            <ScrollView style={tw('h-full')}>
                <Grid columns={1} style={tw('p-3')}>
                    <HoursCard/>
                </Grid>
            </ScrollView>
        </SafeAreaView>
    );
}