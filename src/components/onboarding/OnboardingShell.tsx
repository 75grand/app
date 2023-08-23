import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';
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

    secondaryButtonText = '',
    onPressSecondary,
    isSecondaryLoading = false,
    isSecondaryValid = true,
}: Props) {
    const navigation = useNavigation();
    const user = useStore($user);

    return (
        <>
            <StatusBar animated style="dark"/>

            <SafeAreaView style={tw('h-full bg-white')}>
                <View style={tw('p-6 bg-white h-full justify-between')}>
                    <View style={tw('gap-12 items-center')}>
                        <Logo/>

                        <Text style={tw('text-3xl font-bold text-center')}>
                            {title ? title : user.name ? (
                                <>Welcome, <Text style={tw('text-accent')}>{user.name.split(' ')[0]}</Text>!</>
                            ) : (
                                <>Welcome!</>
                            )}
                        </Text>

                        <View style={tw('w-full gap-6')}>
                            {children}
                        </View>
                    </View>

                    <View style={tw('gap-2')}>
                        <Button
                            text={primaryButtonText}
                            size="mega"
                            loading={isPrimaryLoading}
                            disabled={!isPrimaryValid}
                            onPress={onPressPrimary}
                        />

                        {secondaryButtonText && (
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
            </SafeAreaView>
        </>
    );
}