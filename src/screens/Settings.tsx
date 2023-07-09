import { ScrollView, Alert } from 'react-native';
import Button from '../components/Button';
import tw from '../helpers/tailwind';
import { logout } from '../helpers/api/login';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
    const navigation = useNavigation();

    return (
        <ScrollView style={tw('p-4')}>
            <Button text="Logout" color="red"
                onPress={() => logout().then(navigation.goBack)}/>
        </ScrollView>
    );
}