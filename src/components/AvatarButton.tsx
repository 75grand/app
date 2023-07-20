import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { TouchableOpacity } from 'react-native';
import tw from '../helpers/tailwind';
import { $user } from '../helpers/user/user-store';

export default function AvatarButton() {
    const navigation = useNavigation();
    const user = useStore($user);

    return (
        // @ts-expect-error
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Image style={tw('w-8 h-8 rounded-full')} source={user.avatar}/>
        </TouchableOpacity>
    );
}