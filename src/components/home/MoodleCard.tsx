import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { Alert, LayoutAnimation, Platform, Text, TouchableOpacity, View } from 'react-native';
import { fetchMoodleTasks, patchMoodleTask } from '../../lib/api/api';
import { toUsefulRelative } from '../../lib/date-utils';
import { useRerender } from '../../lib/hooks/use-rerender';
import { sortTasks } from '../../lib/moodle-utils';
import tw, { monospace } from '../../lib/tailwind';
import { pluralize } from '../../lib/text-utils';
import { MoodleTask } from '../../lib/types/moodle';
import { $localSettings } from '../../lib/user/settings-store';
import { $user } from '../../lib/user/user-store';
import Card from '../Card';
import CardHeader from '../CardHeader';
import EmptyState from '../EmptyState';
import TouchableScale from '../TouchableScale';
import EnableMoodleCard from './EnableMoodleCard';
import Button from '../Button';

export default function MoodleCard() {
    const navigation = useNavigation();

    const user = useStore($user);
    const { dismissedMoodleSetup } = useStore($localSettings);

    if(!user.moodle_enabled && (dismissedMoodleSetup || user.position !== 'student')) return null;

    function handleSetUp() {
        // @ts-expect-error
        navigation.navigate('MoodleSetup');
    }

    function handleDismiss() {
        $localSettings.setKey('dismissedMoodleSetup', true);
    }

    return (
        <View style={tw('px-3')}>
            {user.moodle_enabled ? (
                <Card>
                    <MoodleTasks/>
                </Card>
            ) : (
                <EnableMoodleCard>
                    <Button text="Set Up Automatically" onPress={handleSetUp} size="mega"/>
                    <Button text="Not Now" onPress={handleDismiss} color="gray"/>
                </EnableMoodleCard>
            )}
        </View>
    );
}

function MoodleTasks() {
    const { data = [] } = useQuery({
        queryKey: ['assignments'],
        queryFn: fetchMoodleTasks,
        refetchInterval: 30_000
    });

    const sortedTasks = useMemo(() => data.sort(sortTasks), [data]);
    const numDueTasks = sortedTasks.filter(task => !task.completed_at).length;

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
                {sortedTasks.map(task =>
                    <MoodleTaskItem key={task.id} {...task}/>)}
            </View>
        </>
    );
}

function MoodleTaskItem(task: MoodleTask) {
    useRerender(1_000);

    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { warnedAboutMoodleTask } = useStore($localSettings);
    
    const isCompleted = Boolean(task.completed_at);
    const isOverdue = !isCompleted && task.due < DateTime.now();

    const mutation = useMutation({
        mutationFn: (completed: boolean) => patchMoodleTask(task.id, completed),
        onSuccess(newTasks) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            queryClient.setQueryData(['assignments'], newTasks);
        }
    });

    function completeTask() {
        if(!warnedAboutMoodleTask) {
            Alert.alert(
                'You still have to turn this in on Moodle',
                'Marking an assignment as “done” on 75grand is only for you and doesn’t turn it in on Moodle.',
                [{
                    text: 'Got It',
                    onPress: () => $localSettings.setKey('warnedAboutMoodleTask', true)
                }]
            );
        }

        if(Platform.OS === 'ios') Haptics.selectionAsync();
        mutation.mutate(!task.completed_at);
    }

    function showInfo() {
        // @ts-expect-error
        navigation.navigate('MoodleTaskDetail', { task });
    }

    return (
        <View style={tw('flex-row gap-3 items-center')}>
            <Checkbox checked={isCompleted} onPress={completeTask}/>

            <TouchableOpacity disabled={!task.description} onPress={showInfo} style={tw('gap-1 shrink', isCompleted && 'opacity-50')}>
                <Text
                    numberOfLines={1}
                    style={tw('text-base leading-none', isOverdue && 'text-red', { fontFamily: monospace })}
                    children={task.title}
                />

                {!isCompleted && (
                    <Text numberOfLines={1} style={tw('text-sm leading-none text-gray-500 tabular-nums', isOverdue && 'text-red')}>
                        due {toUsefulRelative(task.due)} • {task.class}
                    </Text>
                )}
            </TouchableOpacity>
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