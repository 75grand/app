import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import AvatarButton from '../components/AvatarButton';
import Logo from '../components/Logo';
import FeaturedListings from '../components/home/FeaturedListings';
import HoursCard from '../components/home/HoursCard';
import QuickAccess from '../components/home/QuickAccess';
import tw from '../helpers/tailwind';
import RedditCard from '../components/home/RedditCard';

export const screenOptions: NativeStackNavigationOptions = {
    headerLeft: () => <Logo/>,
    headerTitle: () => <></>,
    headerRight: () => <AvatarButton/>
}

export default function Home() {
    return (
        <>
            <StatusBar animated style="auto"/>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={tw('py-3 gap-3')}>
                    <QuickAccess/>

                    <FeaturedListings/>

                    <View style={tw('px-3 gap-3')}>
                        <HoursCard maxItems={5}/>
                        <RedditCard/>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}