import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { login } from '../helpers/api/login';
import tw from '../helpers/tailwind';
import { $user } from '../helpers/user/user-store';
import Button from './Button';

export default function UserButton() {
    const navigation = useNavigation();
    const user = useStore($user);
    const [loading, setLoading] = useState(false);

    if(Platform.OS === 'android') return;

    async function handlePress() {
        setLoading(true);
        await login();
        setLoading(false);
    }

    if(user !== null) {
        return (
            // @ts-expect-error
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Image style={tw('w-8 h-8 rounded-full')} source={user.avatar}/>
            </TouchableOpacity>
        );
    } else {
        return (
            <Button loading={loading} onPress={handlePress} text="Login"/>
        );
    }
}