import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';
import tw from '../../lib/tailwind';
import Button from '../Button';
import Logo from '../Logo';

interface Props {
    title: React.ReactNode,
    buttonText: string,
    onPress: () => void,
    isLoading: boolean,
    isValid: boolean,
    children: React.ReactNode
}

export default function OnboardingShell({ title, buttonText, onPress, isLoading, isValid, children }: Props) {
    return (
        <>
            <StatusBar animated style="dark"/>

            <SafeAreaView style={tw('h-full bg-white')}>
                <View style={tw('p-6 bg-white h-full justify-between')}>
                    <View style={tw('gap-12 items-center')}>
                        <Logo/>
                        <Text style={tw('text-3xl font-bold text-center')}>{title}</Text>
                        <View style={tw('w-full')}>{children}</View>
                    </View>

                    <Button
                        text={buttonText}
                        size="mega"
                        loading={isLoading}
                        disabled={!isValid}
                        onPress={onPress}
                    />
                </View>
            </SafeAreaView>
        </>
    );
}