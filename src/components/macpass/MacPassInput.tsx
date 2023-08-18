import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import tw, { color } from '../../lib/tailwind';
import Input, { InputProps } from '../Input';
import { useNavigation } from '@react-navigation/native';

export default function MacPassInput(props: InputProps) {
    const navigation = useNavigation();

    return (
        <>
            <Input
                {...props}
                placeholder="Scan or enter manually"
                maxLength={9}
                inputMode="numeric"
                returnKeyType="done"
            />

            <TouchableOpacity
                style={tw('absolute px-3 right-0 top-1.75')}
                // @ts-expect-error
                onPress={() => navigation.navigate('ScanMacPass', { setMacPass: props.setValue })}
            >
                <Ionicons name="camera" size={22} color={color('accent')}/>
            </TouchableOpacity>
        </>
    );
}