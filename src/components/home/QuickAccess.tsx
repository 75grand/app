import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import tw from '../../lib/tailwind';
import { $localSettings } from '../../lib/user/settings-store';
import { openBrowser } from '../../lib/utils';
import Pill from '../Pill';
import { SITE } from '../../lib/constants';
import { $user } from '../../lib/user/user-store';
import { track } from '../../lib/api/analytics';

export default function QuickAccess() {
    const navigation = useNavigation();
    const { mostUsedActions } = useStore($localSettings);
    const user = useStore($user);

    function showMacPass() {
        if($localSettings.get().macPass) {
            // @ts-expect-error
            navigation.navigate('ShowMacPass');
        } else {
            // @ts-expect-error
            navigation.navigate('Settings');
        }
    }

    function showCombination() {
        if($localSettings.get().mailboxCombination && $localSettings.get().mailboxNumber) {
            // @ts-expect-error
            navigation.navigate('ShowCombination');
        } else {
            // @ts-expect-error
            navigation.navigate('Settings');
        }
    }

    function handlePress({ name, action }: typeof items[0]) {
        track('Used quick action', { action: name });

        mostUsedActions[name] = (mostUsedActions[name] ?? 0) + 1;
        $localSettings.setKey('mostUsedActions', {...mostUsedActions});
        action();
    }

    const items = useMemo(() => [
        ['MacPass', 'card', showMacPass],
        user.position === 'student' && ['Mailbox Code', 'lock-open', showCombination],
        ['Time Clock', 'time', () => openBrowser(`${SITE}/redirect/time-clock`)],
        ['Moodle', 'school', () => openBrowser(`${SITE}/redirect/moodle`)],
        ['Reserve Room', 'business', () => openBrowser(`${SITE}/redirect/reserve`)],
        ['Library Catalog', 'book', () => openBrowser(`${SITE}/redirect/library-catalog`)],
        ['Printing & Scanning', 'print', () => openBrowser(`${SITE}/redirect/print`)],
    ].filter(a => a).map(item => ({
        name: item[0] as string,
        icon: item[1] as any,
        action: item[2] as () => void
    }))/* .sort((a, b) => {
        const aUses = mostUsedActions[a.name] ?? 0;
        const bUses = mostUsedActions[b.name] ?? 0;
        return bUses - aUses;
    }) */, [mostUsedActions]);

    const rows = [
        items.slice(0, Math.ceil(items.length/2)),
        items.slice(Math.ceil(items.length/2))
    ]

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={tw('gap-2')}>
                {rows.map((row, index) => (
                    <View key={index} style={tw('flex-row gap-2 px-3')}>
                        {row.map(item => (
                            <TouchableOpacity key={item.name} onPress={() => handlePress(item)}>
                                <Pill
                                    text={item.name}
                                    active={false}
                                    icon={props => <Ionicons {...props} name={item.icon}/>}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}