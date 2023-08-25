import { useState } from 'react';
import { LayoutAnimation, TextInput, View } from 'react-native';
import tw, { color } from '../../lib/tailwind';
import Button from '../Button';

interface Props {
    setValue: (value: string) => void,
    isLoading: boolean
}

export default function ReferralInput({ setValue, isLoading }: Props) {
    const [showInput, setShowInput] = useState(false);
    const [referralCode, setReferralCode] = useState('');

    const isValid = /^[0-z]{6}$/.test(referralCode);

    function handlePress() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowInput(true);
    }

    function handleSubmit() {
        if(!isValid) return;
        setValue(referralCode);
    }

    return (
        <View>
            {showInput ? (
                <View style={tw('flex-row gap-2')}>
                    <TextInput
                        style={tw('grow relative justify-center font-semibold text-white bg-white/20 rounded-xl px-5 py-3.5')}
                        placeholderTextColor={color('text-white/25')}
                        placeholder="Enter Referral Code"
                        value={referralCode}
                        onChangeText={setReferralCode}
                        onSubmitEditing={handleSubmit}
                        autoFocus={true}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        returnKeyType="next"
                        maxLength={6}
                    />

                    <Button
                        text="Next"
                        size="mega"
                        color="faint-white"
                        onPress={handleSubmit}
                        disabled={!isValid}
                        loading={isLoading}
                    />
                </View>
            ) : (
                <Button
                    text="Use a Referral Code"
                    size="mega"
                    color="faint-white"
                    onPress={handlePress}
                />
            )}
        </View>
    );
}