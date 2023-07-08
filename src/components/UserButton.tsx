import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { GET } from '../helpers/api/http';
import { login } from '../helpers/api/login';
import { getUserData, setUserData } from '../helpers/api/user-data';
import { User } from '../helpers/models/user';
import tw from '../helpers/tailwind';
import Button from './Button';

export default function UserButton() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null as User);
    const [loading, setLoading] = useState(false);

    if(Platform.OS === 'android') return;

    useEffect(() => {
        (async () => {
            const user = await getUserData();
            setUser(user);
        })();
    }, []);

    // useEffect(() => {
    //     if(user === null) {
    //         Sentry.setUser(null);
    //     } else {
    //         Sentry.setUser({
    //             id: user.id.toString(),
    //             username: user.name,
    //             email: user.email
    //         });
    //     }
    // }, [user]);

    async function handlePress() {
        setLoading(true);

        await login();
        setLoading(false);

        const user = await GET<User>('user');
        await setUserData(user);
        setUser(user);
    }

    return user ? (
        // @ts-expect-error
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Image style={tw('w-8 h-8 rounded-full')} source={user.avatar}/>
        </TouchableOpacity>
    ) : (
        <Button loading={loading} onPress={handlePress} text="Login"/>
    );
}