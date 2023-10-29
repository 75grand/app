import { ScrollView, Text, View } from 'react-native';
import tw from '../../lib/tailwind';
import Card from '../Card';
import CardHeader from '../CardHeader';
import { Image, ImageSource } from 'expo-image';
import TouchableScale from '../TouchableScale';
import { setAppIcon } from 'expo-dynamic-app-icon';
import { track } from '../../lib/api/analytics';

export default function AlternativeIcons() {
    return (
        <Card>
            <CardHeader title="App Icon" icon="brush"/>

            <ScrollView style={tw('-m-3')} horizontal showsHorizontalScrollIndicator={false}>
                <View style={tw('flex-row gap-3 p-3')}>
                    <Icon id="default" label="Default" source={require('../../../assets/icons/default.png')}/>
                    <Icon id="albino-squirrel" label="Albino" source={require('../../../assets/icons/albino-squirrel.png')}/>
                    <Icon id="scottie" label="Scottie" source={require('../../../assets/icons/scottie.png')}/>
                    <Icon id="the-rock" label="75rock" source={require('../../../assets/icons/the-rock.png')}/>
                    <Icon id="wac" label="Wac Meekly" source={require('../../../assets/icons/wac.png')}/>
                    <Icon id="elon-musk" label="Elon Musk" source={require('../../../assets/icons/elon-musk.png')}/>
                    <Icon id="bell-tower" label="Sex Bell" source={require('../../../assets/icons/bell-tower.png')}/>
                </View>
            </ScrollView>
        </Card>
    );
}

function Icon({ source, id, label }: { source: ImageSource, id: string, label: string }) {
    function handlePress() {
        track('Changed icon', { icon: id });
        setAppIcon(id);
    }

    return (
        <TouchableScale onPress={handlePress} style={tw('gap-1 w-20')}>
            <Image source={source} style={tw('w-full aspect-square rounded-2xl border border-black/10')}/>
            <Text numberOfLines={1} style={tw('text-center text-gray-500')}>{label}</Text>
        </TouchableScale>
    );
}