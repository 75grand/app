import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import tw from '../lib/tailwind';
import { User } from '../lib/types/user';

interface Props {
    name: User['name'],
    avatar: User['avatar'],
    subtitle?: string
}

export default function UserItem({ name, avatar, subtitle }: Props) {
    return (
        <View style={tw('flex-row gap-3 items-center')}>
            <Image source={avatar} style={tw('w-10 h-10 rounded-full bg-gray-200')}/>

            <View>
                <Text style={tw('text-base font-semibold')}>{name}</Text>
                {subtitle && <Text style={tw('text-gray-500')}>{subtitle}</Text>}
            </View>
        </View>
    );
}