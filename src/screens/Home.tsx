import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import AvatarButton from '../components/AvatarButton';
import Logo from '../components/Logo';
import TouchableScale from '../components/TouchableScale';
import FeaturedListings from '../components/home/FeaturedListings';
import HoursCard from '../components/home/HoursCard';
import MoodleCard from '../components/home/MoodleCard';
import NewsCard from '../components/home/NewsCard';
import QuickAccess from '../components/home/QuickAccess';
import RatingPrompt from '../components/home/RatingPrompt';
import tw from '../lib/tailwind';
import RedditCard from '../components/home/RedditCard';
import { track } from '../lib/api/analytics';

export function screenOptions({ navigation }): NativeStackNavigationOptions {
    return {
        headerLeft: () => (
            <TouchableScale onPress={() => {
                track('Learned about the app');
                navigation.navigate('AboutTheApp');
            }}>
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
                    <MoodleCard/>
                    <FeaturedListings/>
                    <NewsCard/>
                    <RedditCard/>
                </View>
            </ScrollView>
        </>
    );
}