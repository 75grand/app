import { useStore } from '@nanostores/react';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, View } from 'react-native';
import tw from '../../lib/tailwind';
import { $user } from '../../lib/user/user-store';
import Button from '../Button';
import Logo from '../Logo';

interface Props {
    title?: React.ReactNode,
    children: React.ReactNode,

    primaryButtonText?: string,
    onPressPrimary: () => void,
    isPrimaryLoading?: boolean,
    isPrimaryValid?: boolean,

    secondaryButtonText?: string,
    onPressSecondary?: () => void,
    isSecondaryLoading?: boolean,
    isSecondaryValid?: boolean
}

export default function OnboardingShell({
    title,
    children,

    primaryButtonText = 'Next',
    onPressPrimary,
    isPrimaryLoading = false,
    isPrimaryValid = true,

    secondaryButtonText = 'Go Back',
    onPressSecondary,
    isSecondaryLoading = false,
    isSecondaryValid = true,
}: Props) {
    const user = useStore($user);

    return (
        <>
            <StatusBar animated style="dark"/>

            <SafeAreaView style={tw('h-full bg-white')}>
                <KeyboardAvoidingView behavior="padding">
                    <View style={tw('p-6 bg-white h-full justify-between')}>
                        <View style={tw('gap-6 items-center shrink')}>
                            <Logo/>

                            <ScrollView style={tw('w-full')} bounces={false} showsVerticalScrollIndicator={false}>
                                <View style={tw('pt-6 gap-12')}>
                                    <Text style={tw('text-3xl font-bold text-center')}>
                                        {title ? title : user.name ? (
                                            <>Welcome, <Text style={tw('text-accent')}>{user.name.split(' ')[0]}</Text>!</>
                                        ) : (
                                            <>Welcome!</>
                                        )}
                                    </Text>

                                    <View style={tw('gap-6')}>
                                        {children}
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                        <View style={tw('gap-2 pt-3')}>
                            <Button
                                text={primaryButtonText}
                                size="mega"
                                loading={isPrimaryLoading}
                                disabled={!isPrimaryValid}
                                onPress={onPressPrimary}
                            />

                            {onPressSecondary && (
                                <Button
                                    text={secondaryButtonText}
                                    color="light"
                                    loading={isSecondaryLoading}
                                    disabled={!isSecondaryValid}
                                    onPress={onPressSecondary}
                                />
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}