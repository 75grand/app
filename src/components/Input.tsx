import { TextInput, TextInputProps, View, Text } from 'react-native';
import tw, { color } from '../helpers/tailwind';

interface Props {
    error?: string,
    prefix?: string,
    suffix?: string
}

export default function Input(props: TextInputProps & Props) {
    const shared = tw('text-base leading-5 py-2');

    return (
        <View style={tw('gap-2')}>
            <View style={tw('bg-white rounded-lg px-3 border border-black/10 flex-row')}>
                {props.prefix && <Text style={shared}>{props.prefix}</Text>}

                <TextInput
                    {...props}
                    placeholderTextColor={color('text-gray-500/50')}
                    style={tw(
                        shared, 'w-full',
                        props.error && 'border-red text-red',
                        props.multiline && 'min-h-16 max-h-48'
                    )}
                />

                {props.suffix && <Text style={shared}>{props.suffix}</Text>}
            </View>

            {props.error &&
                <Text style={tw('font-semibold ml-1 text-red')}>{props.error}</Text>}
        </View>
    );
}