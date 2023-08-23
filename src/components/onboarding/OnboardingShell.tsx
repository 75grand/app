import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';
import tw from '../../lib/tailwind';
import Button from '../Button';
import Logo from '../Logo';

interface Props {
    title: React.ReactNode,
    buttonText?: string,
    onPress: () => void,
    isLoading?: boolean,
    isValid?: boolean,
    showBackButton?: boolean,
    children: React.ReactNode
}

export default function OnboardingShell({ title, buttonText = 'Next', onPress, isLoading = false, isValid = true, showBackButton = false, children }: Props) {
    const navigation = useNavigation();

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

                    <View style={tw('gap-2')}>
                        <Button
                            text={buttonText}
                            size="mega"
                            loading={isLoading}
                            disabled={!isValid}
                            onPress={onPress}
                        />

                        {showBackButton && (
                            <Button
                                text="Back"
                                color="light"
                                onPress={navigation.goBack}
                            />
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}