import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { View } from 'react-native';
import Button from '../components/Button';
import Logo from '../components/Logo';
import UserButton from '../components/UserButton';
import tw from '../helpers/tailwind';
import { useNavigation } from '@react-navigation/native';

export const screenOptions: NativeStackNavigationOptions = {
    headerLeft: () => <Logo/>,
    headerTitle: () => <></>,
    headerRight: () => <UserButton/>
}

export default function Home() {
    const navigation = useNavigation();

    return (
        <View style={tw('p-3 gap-3')}>
            <Button
                text="Show MacPass"
                size="mega"
                // @ts-expect-error
                onPress={() => navigation.navigate('ShowMacPass')}
            />

            <Button
                text="Show Mailbox Combination"
                size="mega"
                // @ts-expect-error
                onPress={() => navigation.navigate('ShowCombination')}
            />
        </View>
    );
}