import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import tw from '../../lib/tailwind';
import { User } from '../../lib/types/user';

export default function Profile({ name, avatar, email, id }: User) {
    return (
        <View style={tw('flex-row gap-3 items-center')}>
            <Image style={tw('w-14 h-14 rounded-lg')} source={avatar}/>

            <View style={tw('gap-1')}>
                <View style={tw('flex-row items-baseline gap-2')}>
                    <Text style={tw('leading-none text-lg font-semibold')}>{name}</Text>
                    <Text style={tw('leading-none text-sm font-semibold text-gray-500')}>#{id.toLocaleString()}</Text>
                </View>

                <Text style={tw('leading-none text-base text-gray-500')}>{email}</Text>
            </View>
        </View>
    );
}