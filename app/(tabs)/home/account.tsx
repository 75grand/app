import { Stack, useRouter } from 'expo-router';
import { Alert, Text } from 'react-native';
import { useState } from 'react';
import Button from '../../../components/Button';
import { logout } from '../../../lib/login';

export default function() {
    const [logoutLoading, setLogoutLoading] = useState(false);
    const router = useRouter();

    function handleLogout() {
        Alert.alert('Are you sure?', null, [
            {
                isPreferred: true,
                style: 'cancel',
                text: 'Cancel',
                onPress: () => setLogoutLoading(false)
            },
            {
                style: 'destructive',
                text: 'Logout',
                onPress: () => logout().then(() => {
                    setLogoutLoading(false);
                    router.replace('/');
                })
            }
        ]);

        setLogoutLoading(true);
    }

    return (
        <>
            <Stack.Screen options={{
                title: 'Account',
                headerRight: () => <Button loading={logoutLoading} onPress={handleLogout} text="Logout" color="red"/>
            }}/>

            <Text>account</Text>
        </>
    );
}