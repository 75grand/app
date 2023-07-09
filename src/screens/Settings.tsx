import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Button from '../components/Button';
import { logout } from '../helpers/api/login';
import tw from '../helpers/tailwind';

export function screenOptions({ navigation }): NativeStackNavigationOptions {
    return {
        presentation: 'modal',
        headerLeft: () => (
            <HeaderButtons left>
                <Item title="Cancel" onPress={navigation.goBack}/>
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons>
                <Item
                    title="Done"
                    buttonStyle={tw('font-semibold')}
                />
            </HeaderButtons>
        )
    }
}

export default function Settings() {
    return (
        <>
            <StatusBar animated style="light"/>

            <ScrollView style={tw('p-4')}>
                <Button text="Logout" color="red" onPress={logout}/>
            </ScrollView>
        </>
    );
}