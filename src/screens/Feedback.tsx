import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Input from '../components/Input';
import InputLabel from '../components/InputLabel';
import { postFeedback } from '../helpers/api/api';
import tw, { color } from '../helpers/tailwind';
import { $user } from '../helpers/user/user-store';

export const screenOptions: NativeStackNavigationOptions = {
    presentation: 'modal',
    title: 'Send Feedback'
}

export default function Feedback() {
    const navigation = useNavigation();

    const [message, setMessage] = useState('');
    const user = useStore($user);

    const mutation = useMutation({
        mutationFn: () => postFeedback(message),
        onSuccess() {
            Alert.alert('Thanks for your feedback!');
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
                            disabled={message.length < 5}
                            style={tw(message.length < 5 && 'opacity-50')}
                        />
                    )}
                </HeaderButtons>
            )
        });
    }, [mutation, message]);

    return (
        <>
            <StatusBar animated style="light"/>

            <ScrollView>
                <View style={tw('p-3 gap-4')}>
                    <InputLabel text="Email">
                        <Input
                            setValue={v => v}
                            value={user.email}
                            editable={false}
                        />
                    </InputLabel>

                    <InputLabel text="Message">
                        <Input multiline
                            value={message}
                            setValue={setMessage}
                            placeholder="What’s up?"
                        />
                    </InputLabel>
                </View>
            </ScrollView>
        </>
    );
}