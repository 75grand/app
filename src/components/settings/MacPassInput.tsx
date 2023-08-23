import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import tw, { color } from '../../lib/tailwind';
import Input, { InputProps } from '../Input';
import TouchableScale from '../TouchableScale';

export default function MacPassInput(props: InputProps) {
    const navigation = useNavigation();

    function handlePress() {
        // @ts-expect-error
        navigation.navigate('ScanMacPass', { setMacPass: props.setValue })
    }

    return (
        <View style={tw('relative items-end justify-center')}>
            <Input
                {...props}
                placeholder="Scan or enter manually"
                maxLength={9}
                inputMode="numeric"
                returnKeyType="done"
            />

            <TouchableScale containerStyle={tw('absolute px-3 h-full')} onPress={handlePress}>
                <View style={tw('h-full justify-center')}>
                    <Ionicons name="camera" size={22} color={color('accent')}/>
                </View>
            </TouchableScale>
        </View>
    );
}