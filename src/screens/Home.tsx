import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import AvatarButton from '../components/AvatarButton';
import Logo from '../components/Logo';
import TouchableScale from '../components/TouchableScale';
import FeaturedListings from '../components/home/FeaturedListings';
import HoursCard from '../components/home/HoursCard';
import MoodleCard from '../components/home/MoodleCard';
import QuickAccess from '../components/home/QuickAccess';
import RatingPrompt from '../components/home/RatingPrompt';
import RedditCard from '../components/home/RedditCard';
import tw from '../lib/tailwind';

export function screenOptions({ navigation }): NativeStackNavigationOptions {
    return {
        headerLeft: () => (
            <TouchableScale onPress={() => navigation.navigate('AboutTheApp')}>
                <Logo/>
            </TouchableScale>
        ),
        headerTitle: () => <></>,
        headerRight: () => <AvatarButton/>
    }
}

export default function Home() {
    return (
        <>
            <StatusBar animated style="auto"/>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={tw('py-3 gap-3')}>
                    <QuickAccess/>

                    <RatingPrompt/>

                    <HoursCard/>

                    <FeaturedListings/>

                    <MoodleCard/>

                    <View style={tw('px-3')}>
                        <RedditCard/>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}