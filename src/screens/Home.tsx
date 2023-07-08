import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import Logo from '../components/Logo';
import UserButton from '../components/UserButton';
import tw from '../helpers/tailwind';

export const screenOptions: NativeStackNavigationOptions = {
    headerLeft: () => <Logo/>,
    headerTitle: () => <></>,
    headerRight: () => <UserButton/>
}

export default function Home() {
    return (
        <>
            <Text>Home</Text>
        </>
    );
}