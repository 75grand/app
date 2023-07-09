import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import Button from '../components/Button';
import { login } from '../helpers/api/login';
import { SafeAreaView, View } from 'react-native';
import tw from '../helpers/tailwind';
import { useState } from 'react';

export const screenOptions: NativeStackNavigationOptions = {
    headerShown: false
}

export default function LoginWall() {
    const [loading, setLoading] = useState(false);

    return (
        <SafeAreaView>
            <View style={tw('p-3')}>
                <Button
                    text="Login with Google"
                    size="mega"
                    onPress={async () => {
                        setLoading(true);
                        await login();
                        setLoading(false);
                    }}
                    loading={loading}
                />
            </View>
        </SafeAreaView>
    );
}