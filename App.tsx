import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, View } from 'react-native';
import IconCard from './components/home/IconCard';
import tw, { twBase } from './lib/tailwind';
import RedditCard from './components/home/RedditCard';
import { useDeviceContext } from 'twrnc';
import HoursCard from './components/home/HoursCard';

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

    return (
        <>
            <StatusBar style="auto"/>
            <SafeAreaView style={tw('justify-center items-center flex-row flex-1')}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={tw('flex flex-wrap flex-row w-full p-1.5')}>
                        <View style={tw('p-1.5 w-full')}>
                            <HoursCard/>
                        </View>

                        <View style={tw('p-1.5 w-full')}>
                            <RedditCard/>
                        </View>

                        {cards.map(card => (
                            <View key={card.title} style={tw('w-1/2 p-1.5')}>
                                <IconCard {...card} onPress={() => alert(card.title)}/>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}
