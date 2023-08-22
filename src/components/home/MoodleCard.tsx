import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { LayoutAnimation, Text, View } from 'react-native';
import { fetchMoodleTasks } from '../../lib/api/api';
import { useRerender } from '../../lib/hooks/use-rerender';
import { completeTask, sortTasks } from '../../lib/moodle-utils';
import tw, { monospace } from '../../lib/tailwind';
import { pluralize } from '../../lib/text-utils';
import { MoodleTask } from '../../lib/types/moodle';
import { $localSettings } from '../../lib/user/settings-store';
import { $user } from '../../lib/user/user-store';
import Button from '../Button';
import Card from '../Card';
import CardHeader from '../CardHeader';
import EmptyState from '../EmptyState';
import TouchableScale from '../TouchableScale';

export default function MoodleCard() {
    const navigation = useNavigation();

    const user = useStore($user);
    const { dismissedMoodleSetup } = useStore($localSettings);

    if(!user.moodle_enabled && (dismissedMoodleSetup || user.position !== 'student')) return;

    function handleSetUp() {
        // @ts-expect-error
        navigation.navigate('MoodleSetup');
    }

    function handleDismiss() {
        $localSettings.setKey('dismissedMoodleSetup', true);
    }

    return (
        <View style={tw('px-3')}>
            <Card>
                {user.moodle_enabled ? (
                    <MoodleTasks/>
                ) : (
                    <>
                        <CardHeader
                            title="Moodle"
                            customIcon={props => <FontAwesome5 name="graduation-cap" {...props}/>}
                        />

                        <View style={tw('gap-3 -mt-1')}>
                            <Text style={tw('text-base')}>
                                75grand can display your Moodle assignments and
                                remind you before they're due.
                            </Text>

                            <Button text="Set Up Automatically" onPress={handleSetUp} size="mega"/>
                            <Button text="Not Now" onPress={handleDismiss} color="gray"/>

                            <Text style={tw('text-xs text-gray-500')}>
                                Notifications will be sent when the assignment is due
                                and at 9:00 AM the day before.
                                
                                This feature does not store your login credentials
                                and was not developed by Moodle or ITS.
                            </Text>
                        </View>
                    </>
                )}
            </Card>
        </View>
    );
}

function MoodleTasks() {
    const { data = [] } = useQuery({
        queryKey: ['assignments'],
        queryFn: fetchMoodleTasks,
        refetchInterval: 30_000
    });

    const { completedMoodleTasks } = useStore($localSettings);
    const sortedTasks = useMemo(() => data.sort(sortTasks), [data, completedMoodleTasks]);
    const numDueTasks = sortedTasks.filter(task => !completedMoodleTasks.includes(task.id)).length;

    if(sortedTasks.length === 0) {
        return (
            <EmptyState
                icon="file-tray"
                title="No assignments"
                subtitle="Enjoy it while it lasts"
            />
        );
    }

    return (
        <>
            <CardHeader
                title="Moodle"
                subtitle={`${numDueTasks} ${pluralize(numDueTasks, 'assignment')} due`}
                customIcon={props => <FontAwesome5 name="graduation-cap" {...props}/>}
            />

            <View style={tw('gap-4')}>
                {sortedTasks.map(MoodleTaskItem)}
            </View>
        </>
    );
}

function MoodleTaskItem(task: MoodleTask) {
    useRerender(1_000);
    
    const { completedMoodleTasks } = useStore($localSettings);
    
    const isCompleted = completedMoodleTasks.includes(task.id);
    const isOverdue = !isCompleted && task.due < DateTime.now();

    function handlePress() {
        Haptics.selectionAsync();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        completeTask(task);
    }

    return (
        <View key={task.id} style={tw('flex-row gap-3 items-center')}>
            <Checkbox checked={isCompleted} onPress={handlePress}/>

            <View style={tw('gap-1', isCompleted && 'opacity-50')}>
                <Text
                    numberOfLines={1}
                    style={tw('text-base leading-none', isOverdue && 'text-red', { fontFamily: monospace })}
                    children={task.title}
                />

                {!isCompleted && (
                    <Text numberOfLines={1} style={tw('text-sm leading-none text-gray-500 tabular-nums', isOverdue && 'text-red')}>
                        due {task.due.toRelativeCalendar()} • {task.class}
                    </Text>
                )}
            </View>
        </View>
    );
}

function Checkbox({ checked, onPress }: { checked: boolean, onPress: () => void }) {
    return (
        <TouchableScale onPress={onPress} style={tw('w-5 h-5 rounded-md border border-black/20 items-center justify-center', checked && 'bg-accent')}>
            {checked && <Ionicons name="checkmark" size={18} color="white"/>}
        </TouchableScale>
    );
}