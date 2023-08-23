import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import tw from '../../lib/tailwind';

export default function NotificationSellingPoints() {
    return (
        <ScrollView style={tw('w-full grow-0')} bounces={false}>
            <View style={tw('gap-6')}>
                <SellingPoint
                    icon="calendar"
                    title="Event Notifications"
                    text="Sign up to be notified about events happening around campus"
                />

                <SellingPoint
                    icon="checkmark-circle"
                    title="Moodle Assignments"
                    text="Never loose an assignment to the depths of Moodle again"
                />

                <SellingPoint
                    icon="car"
                    title="Carpooling (coming soon)"
                    text="Coordinate rides to the airport, Minneapolis, nature, and more"
                />

                {/* <SellingPoint
                    icon="restaurant"
                    title="Favorite Food (coming soon)"
                    text="Get notified when Café Mac serves your favorite foods"
                /> */}

                <SellingPoint
                    icon="star"
                    title="New Features"
                    text="Occasional notifications when major features are added to 75grand"
                />
            </View>
        </ScrollView>
    );
}

function SellingPoint({ icon, title, text }: { icon: keyof typeof Ionicons.glyphMap, title: string, text: string }) {
    return (
        <View style={tw('flex flex-row gap-6 items-center')}>
            <Ionicons style={tw('text-3xl text-accent')} name={icon}/>

            <View style={tw('shrink')}>
                <Text style={tw('text-base font-semibold')}>{title}</Text>
                <Text style={tw('text-base text-gray-500 leading-tight')}>{text}</Text>
            </View>
        </View>
    );
}