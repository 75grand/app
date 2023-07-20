import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { TouchableOpacity, View } from 'react-native';
import tw from '../helpers/tailwind';
import { $user } from '../helpers/user/user-store';
import Button from './Button';

export default function AvatarButton() {
    const navigation = useNavigation();
    const user = useStore($user);

    return (
        <View style={tw('flex-row gap-2 items-stretch')}>
            <Button
                color="faint"
                text="Feedback"
                // @ts-expect-error
                onPress={() => navigation.navigate('Feedback')}
            />

            <TouchableOpacity // @ts-expect-error
                onPress={() => navigation.navigate('Settings')}>
                <Image style={tw('w-8 h-8 rounded-lg')} source={user.avatar}/>
            </TouchableOpacity>
        </View>
    );
}