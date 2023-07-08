import { Ionicons } from '@expo/vector-icons';
import { TextInput, TextInputProps, View } from 'react-native';
import tw from '../helpers/tailwind';

export default function Input(props: TextInputProps & { search?: boolean }) {
    return (
        <View style={tw('gap-2 bg-white rounded-lg border border-black/10 flex flex-row items-center')}>
            {props.search && <Ionicons style={tw('text-gray-400 pl-3')} name="search" size={18}/>}

            <TextInput
                style={tw('pr-4.5 py-2 text-base leading-5 w-full', props.search || 'pl-4.5')}
                {...props}
            />
        </View>
    );
}