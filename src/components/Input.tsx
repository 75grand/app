import { TextInput, TextInputProps, View, Text } from 'react-native';
import MaskInput, { MaskInputProps } from 'react-native-mask-input';
import tw, { color } from '../lib/tailwind';

interface Props {
    error?: string,
    prefix?: string,
    suffix?: string,
    value: TextInputProps['value'],
    setValue: (value: string) => void
}

export default function Input(props: TextInputProps & Props & MaskInputProps) {
    const shared = tw('text-base leading-5 py-2');
    const InputElement = props.mask ? MaskInput : TextInput;

    /**
     * Single function for state in masked and unmasked inputs
     * @see https://github.com/CaioQuirinoMedeiros/react-native-mask-input
     * @param args If masked, unmasked is the second item, otherwise the first
     */
    function handleChange(...args) {
        props.setValue(args[props.mask ? 1 : 0]);
    }

    return (
        <View style={tw('gap-2')}>
            <View style={tw('bg-white rounded-lg px-3 border border-black/10 flex-row', props.error && 'border-red')}>
                {props.prefix && <Text style={shared}>{props.prefix}</Text>}

                <InputElement
                    {...props}
                    onChangeText={handleChange}
                    placeholderTextColor={color('text-gray-500/50')}
                    style={tw(
                        shared, 'w-full',
                        props.error && 'text-red',
                        props.multiline && 'min-h-24 max-h-48'
                    )}
                />

                {props.suffix && <Text style={shared}>{props.suffix}</Text>}
            </View>

            {props.error && <Text style={tw('font-semibold ml-1 text-red text-sm leading-none')}>{props.error}</Text>}
        </View>
    );
}