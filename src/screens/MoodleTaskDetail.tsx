import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { DateTime } from 'luxon';
import { Platform, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Card from '../components/Card';
import TextWithLinks from '../components/TextWithLinks';
import tw, { monospace } from '../lib/tailwind';
import { MoodleTask } from '../lib/types/moodle';

export function screenOptions({ navigation }): NativeStackNavigationOptions {
    return {
        title: 'Assignment',
        presentation: 'modal',
        gestureEnabled: false,
        headerShown: true,
        headerLeft: () => (
            <HeaderButtons left>
                <Item title="Close" onPress={navigation.goBack}/>
            </HeaderButtons>
        )
    }
}

export default function MoodleTaskDetail() {
    const params = useRoute().params as any;
    const task: MoodleTask = params.task;

    const isOverdue = !task.completed_at && task.due < DateTime.now();

    const dueDate = task.due.toLocaleString({
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });

    return (
        <>
            {Platform.OS !== 'android' && <StatusBar animated style="light"/>}

            <ScrollView>
                <SafeAreaView>
                    <View style={tw('gap-3 p-3')}>
                        <Card style={tw('gap-1')}>
                            <Text style={tw('text-xl font-semibold leading-tight')}>{task.title}</Text>

                            <View style={tw('flex-row items-center gap-1')}>
                                <Text>{task.class}</Text>
                                <Text style={tw('text-gray-400')}>•</Text>
                                <Text style={tw(isOverdue && 'text-red')}>{dueDate}</Text>
                            </View>
                        </Card>

                        {task.description && (
                            <Card>
                                <TextWithLinks
                                    text={task.description}
                                    style={tw('text-base', { fontFamily: monospace })}
                                />
                            </Card>
                        )}
                    </View>
                </SafeAreaView>
            </ScrollView>
        </>
    );
}

