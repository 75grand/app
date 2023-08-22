import { useStore } from '@nanostores/react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useLayoutEffect } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { z } from 'zod';
import Card from '../components/Card';
import Input from '../components/Input';
import InputLabel from '../components/InputLabel';
import { postFeedback } from '../lib/api/api';
import { useForm } from '../lib/hooks/use-form';
import tw, { color } from '../lib/tailwind';
import { $user } from '../lib/user/user-store';

export const screenOptions: NativeStackNavigationOptions = {
    presentation: 'modal',
    title: 'Send Feedback'
}

export default function Feedback() {
    const navigation = useNavigation();

    const params = useRoute().params as any;
    const initialMessage = params?.message ?? '';

    const user = useStore($user);

    const { fields, formData, isValid } = useForm(
        z.object({
            email: z.string().email().default(user.email),
            message: z.string().default(initialMessage)
        })
    );

    const mutation = useMutation({
        mutationFn: () => postFeedback(formData.message, formData.email),
        onSuccess() {
            Alert.alert('Thanks!', 'Your feedback has been sent.');
            navigation.goBack();
        }
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderButtons left>
                    <Item
                        title="Cancel"
                        onPress={navigation.goBack}
                    />
                </HeaderButtons>
            ),
            headerRight: () => (
                <HeaderButtons>
                    {mutation.isLoading ? (
                        <ActivityIndicator color={color('accent')}/>
                    ): (
                        <Item
                            title="Send"
                            buttonStyle={tw('font-semibold')}
                            onPress={() => mutation.mutate()}
                            disabled={!isValid}
                            style={tw(isValid || 'opacity-50')}
                        />
                    )}
                </HeaderButtons>
            )
        });
    }, [mutation, isValid]);

    return (
        <>
            <StatusBar animated style="light"/>

            <KeyboardAwareScrollView>
                <View style={tw('p-3')}>
                    <Card style={tw('gap-4')}>
                        <InputLabel required text="Email">
                            <Input
                                {...fields.email}
                                editable={false}
                            />
                        </InputLabel>

                        <InputLabel required text="Message">
                            <Input multiline
                                {...fields.message}
                                placeholder="How can we do better?"
                                autoFocus={!initialMessage}
                            />
                        </InputLabel>

                        <Text style={tw('text-sm text-gray-500')}>
                            75grand is not an official app. It is not developed, maintained,
                            or affiliated in any way with Macalester. Do not contact ITS for
                            support; use this form.
                        </Text>
                    </Card>
                </View>
            </KeyboardAwareScrollView>
        </>
    );
}