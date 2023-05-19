import { Image } from 'expo-image';
import { Platform, TouchableOpacity } from 'react-native';
import tw from '../lib/tailwind';
import Button from './Button';
import { useState } from 'react';
import { get } from '../lib/http';
import type { User } from '../lib/models/user';
import { useRouter } from 'expo-router';
import { login } from '../lib/login';

export default function User() {
    const router = useRouter();
    const [user, setUser] = useState(null as User);
    const [loading, setLoading] = useState(false);

    if(Platform.OS === 'android') return;

    async function handlePress() {
        setLoading(true);

        login().then(() => {
            setLoading(false);
            get<User>('user').then(setUser);
        });
    }

    return user ? (
        <TouchableOpacity onPress={() => router.push('/home/account')}>
            <Image style={tw('w-8.5 h-8.5 rounded-full')} source={user.avatar}/>
        </TouchableOpacity>
    ) : (
        <Button loading={loading} onPress={handlePress} text="Login"/>
    );
}