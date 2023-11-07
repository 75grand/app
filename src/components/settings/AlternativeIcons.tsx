import { LayoutAnimation, Platform, ScrollView, Text, View } from 'react-native';
import tw from '../../lib/tailwind';
import Card from '../Card';
import CardHeader from '../CardHeader';
import { Image, ImageSource } from 'expo-image';
import TouchableScale from '../TouchableScale';
import { getAppIcon, setAppIcon } from 'expo-dynamic-app-icon';
import { track } from '../../lib/api/analytics';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';

export default function AlternativeIcons() {
    const [selectedIcon, setSelectedIcon] = useState(getAppIcon() || 'default_icon');

    const icons = [
        {
            id: 'default_icon',
            label: 'Default',
            source: require('../../../assets/icons/default_icon.png')
        },
        {
            id: 'albino_squirrel',
            label: 'Albino',
            source: require('../../../assets/icons/albino_squirrel.png')
        },
        {
            id: 'scottie',
            label: 'Scottie',
            source: require('../../../assets/icons/scottie.png')
        },
        {
            id: 'the_rock',
            label: '75rock',
            source: require('../../../assets/icons/the_rock.png')
        },
        {
            id: 'wac',
            label: 'Wac Meekly',
            source: require('../../../assets/icons/wac.png')
        },
        {
            id: 'elon_musk',
            label: 'Elon Musk',
            source: require('../../../assets/icons/elon_musk.png')
        },
        {
            id: 'bell_tower',
            label: 'Sex Bell',
            source: require('../../../assets/icons/bell_tower.png')
        }
    ]

    function handlePress(id: string) {
        track('Changed icon', { icon: id });
        if(Platform.OS === 'ios') Haptics.selectionAsync();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedIcon(setAppIcon(id) || 'default');
    }

    return (
        <Card>
            <CardHeader title="App Icon" icon="brush"/>

            <ScrollView style={tw('-m-3')} horizontal showsHorizontalScrollIndicator={false}>
                <View style={tw('flex-row gap-3 p-3')}>
                    {icons.map(icon =>
                        <TouchableScale key={icon.id} onPress={() => handlePress(icon.id)}>
                            <Icon selected={icon.id === selectedIcon} {...icon}/>
                        </TouchableScale>
                    )}
                </View>
            </ScrollView>
        </Card>
    );
}

function Icon({ source, label, selected }: { source: ImageSource, label: string, selected: boolean }) {
    return (
        <View style={tw('gap-1 w-20')}>
            <MotiView animate={{ transform: [{ scale: selected ? 1 : 0.8 }] }}>
                <Image source={source}
                    style={tw('w-full aspect-square rounded-2xl border border-black/10')}/>
            </MotiView>

            <Text numberOfLines={1} style={tw('text-center text-gray-500')}>{label}</Text>
        </View>
    );
}