import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Text } from 'react-native';

export const screenOptions: NativeStackNavigationOptions = {
    title: 'Campus Hours'
}

export default function Hours() {
    return (
        <Text>Hours</Text>
    );
}