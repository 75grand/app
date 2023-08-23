import { useStore } from '@nanostores/react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useLayoutEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Masks } from 'react-native-mask-input';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { z } from 'zod';
import Button from '../components/Button';
import Card from '../components/Card';
import Grid from '../components/Grid';
import Input from '../components/Input';
import InputLabel from '../components/InputLabel';
import MacPassInput from '../components/macpass/MacPassInput';
import Profile from '../components/settings/Profile';
import ReferralCode from '../components/settings/ReferralCode';
import { fetchUser, patchUser } from '../lib/api/api';
import { logout } from '../lib/api/login';
import { useForm } from '../lib/hooks/use-form';
import tw, { color } from '../lib/tailwind';
import { User } from '../lib/types/user';
import { $localSettings } from '../lib/user/settings-store';
import { $user } from '../lib/user/user-store';
import * as StoreReview from 'expo-store-review';
import { zMacPass, zMailboxCombination } from '../lib/types/utils';

export const screenOptions: NativeStackNavigationOptions = {
    presentation: 'modal',
    gestureEnabled: false,
    title: 'Profile'
}

export default function Settings() {
    const navigation = useNavigation();

    const user = useStore($user);
    const settings = useStore($localSettings);

    const mutation = useMutation({
        mutationFn: (phone: string) => patchUser({ phone }),
        onSuccess: user => $user.set(user)
    });

    const { fields, isValid, formData } = useForm(
        z.object({
            phone: User.shape.phone.optional().default(user.phone),
            macPass: zMacPass.default(settings.macPass),
            mailboxNumber: z.string().optional().default(settings.mailboxNumber),
            mailboxCombination: zMailboxCombination.default(settings.mailboxCombination)
        })
    );

    useEffect(() => { fetchUser().then($user.set) }, []);

    async function saveSettings() {
        $localSettings.setKey('macPass', formData.macPass);
        $localSettings.setKey('mailboxNumber', formData.mailboxNumber);
        $localSettings.setKey('mailboxCombination', formData.mailboxCombination);

        await mutation.mutateAsync(formData.phone);

        navigation.goBack();
    }

    function handleLogoutPress() {
        setTimeout(logout);

        navigation.dispatch(
            StackActions.replace('Login')
        );
    }

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
                            title="Save"
                            buttonStyle={tw('font-semibold')}
                            onPress={saveSettings}
                            disabled={!isValid}
                            style={tw(isValid || 'opacity-50')}
                        />
                    )}
                </HeaderButtons>
            )
        });
    }, [saveSettings, mutation.isLoading, isValid]);

    return (
        <>
            <StatusBar animated style="light"/>

            <KeyboardAwareScrollView>
                <View style={tw('gap-3 p-3')}>
                    <Card>
                        <Profile {...user}/>
                    </Card>

                    <Card>
                        <ReferralCode {...user}/>
                    </Card>

                    <Card style={tw('gap-4')}>
                        <InputLabel text="Phone Number">
                            <Input
                                {...fields.phone}
                                mask={Masks.USA_PHONE}
                                placeholder="(651) 696-6000"
                                maxLength={14}
                                inputMode="numeric"
                            />
                        </InputLabel>

                        <InputLabel text="MacPass Number">
                            <MacPassInput {...fields.macPass}/>
                        </InputLabel>

                        <Grid columns={2}>
                            <InputLabel text="Mailbox Number">
                                <Input
                                    {...fields.mailboxNumber}
                                    placeholder="1605"
                                    maxLength={4}
                                    inputMode="numeric"
                                    returnKeyType="done"
                                />
                            </InputLabel>

                            <InputLabel text="Mailbox Combination">
                                <Input
                                    {...fields.mailboxCombination}
                                    mask={[/[0-4]/, /\d/, '-', /[0-4]/, /\d/, '-', /[0-4]/, /\d/]}
                                    placeholder="33-05-27"
                                    maxLength={8}
                                    inputMode="decimal"
                                    returnKeyType="done"
                                />
                            </InputLabel>
                        </Grid>
                    </Card>

                    <Button
                        text="Log Out & Delete Local Data"
                        color="faint-red"
                        onPress={handleLogoutPress}
                    />
                </View>
            </KeyboardAwareScrollView>
        </>
    );
}