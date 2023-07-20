import { TextInput, TextInputProps, View, Text } from 'react-native';
import tw, { color } from '../helpers/tailwind';

interface Props {
    error?: string
}

export default function Input(props: TextInputProps & Props) {
    return (
        <View style={tw('gap-2')}>
            <TextInput
                {...props}
                placeholderTextColor={color('text-gray-500/50')}
                style={tw(
                    'px-3 py-2 text-base leading-5 w-full',
                    'bg-white rounded-lg border border-black/10',
                    props.error && 'border-red text-red',
                    props.multiline && 'min-h-16 max-h-48'
                )}
            />

            {props.error &&
                <Text style={tw('font-semibold ml-1 text-red')}>{props.error}</Text>}
        </View>
    );
}