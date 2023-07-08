import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, Text, SafeAreaView } from 'react-native';
import { useDeviceContext } from 'twrnc';
import HoursCard from '../../../src/components/home/HoursCard';
import IconCard from '../../../src/components/home/IconCard';
import RedditCard from '../../../src/components/home/RedditCard';
import tw, { twBase } from '../../../src/helpers/tailwind';
import Logo from '../../../src/components/Logo';
import Button from '../../../src/components/Button';
import Grid from '../../../src/components/Grid';
import QuickAccess from '../../../src/components/home/QuickAccess';
import UserButton from '../../../src/components/UserButton';

export default function App() {
    useDeviceContext(twBase);

    const cards = [
        ['Printing', 'bg-red', 'printer'],
        ['Moodle', 'bg-orange', 'school'],
        ['Campus Map', 'bg-green', 'map'],
        ['Campus Events', 'bg-blue', 'calendar'],
        ['Summit', 'bg-[#253c6c]', 'newspaper'],
        ['Your Grades', 'bg-pink', 'alpha-f-circle'],
        ['Building Hours', 'bg-purple', 'clock'],
        ['Menus', 'bg-brown', 'silverware-fork-knife'],
        ['MacPass', 'bg-teal', 'card-account-details-outline'],
        ['Clock In/Out', 'bg-mint', 'briefcase-clock'],
        ['Study Spots', 'bg-indigo', 'sofa-single'],
    ].map(card => {
        return {
            title: card[0],
            style: tw(card[1]),
            icon: card[2] as any
        }
    });

    const router = useRouter();

    return (
        <>
            <StatusBar style="auto"/>

            <Stack.Screen options={{
                title: '75grand',
                headerLeft: () => <Logo/>,
                headerTitle: () => <></>,
                headerRight: () => <UserButton/>,
            }}/>

            <SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={tw('pt-3')}>
                        <QuickAccess/>
                    </View>

                    <Grid columns={1} style={tw('p-3')}>
                        <View style={tw('w-full')}>
                            <HoursCard onPress={() => router.push('building-hours')}/>
                        </View>

                        <View style={tw('w-full')}>
                            <RedditCard/>
                        </View>

                        <Grid columns={2}>
                            {cards.map(card => (
                                <View key={card.title} style={tw('w-full')}>
                                    <IconCard {...card} onPress={() => alert(card.title)}/>
                                </View>
                            ))}
                        </Grid>
                    </Grid>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}
