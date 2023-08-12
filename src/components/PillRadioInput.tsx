import { ScrollView, View } from 'react-native';
import tw from '../lib/tailwind';
import Button from './Button';
import { StringRecord } from '../lib/types/utils';

interface Props {
    options: StringRecord|string[],
    value: string,
    setValue: (value: string) => void,
    allowEmpty?: boolean,
    scroll?: boolean
}

export default function PillRadioInput({ options, value, setValue, allowEmpty = false, scroll = false }: Props) {
    if(Array.isArray(options)) {
        const optionsObject = {};
        options.forEach(option => optionsObject[option] = option);
        options = optionsObject;
    }

    return (
        <ScrollView scrollEnabled={scroll} style={tw('-m-3')} horizontal showsHorizontalScrollIndicator={false}>
            <View style={tw('flex-row gap-2 p-3')}>
                {Object.entries(options).map(([thisValue, label]) => {
                    return (
                        <Button
                            key={thisValue}
                            text={label}
                            onPress={() => setValue(allowEmpty && thisValue === value ? null : thisValue)}
                            color={thisValue === value ? 'accent' : 'gray'}
                        />
                    );
                })}
            </View>
        </ScrollView>
    );
}