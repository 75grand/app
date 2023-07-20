import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Button from '../components/Button';
import Card from '../components/Card';
import Grid from '../components/Grid';
import Input from '../components/Input';
import InputLabel from '../components/InputLabel';
import Profile from '../components/settings/Profile';
import ReferralCode from '../components/settings/ReferralCode';
import { patchUser } from '../helpers/api/api';
import { logout, refreshUser } from '../helpers/api/login';
import tw, { color } from '../helpers/tailwind';
import { $localSettings } from '../helpers/user/settings-store';
import { $user } from '../helpers/user/user-store';
import { Masks } from 'react-native-mask-input';

export const screenOptions: NativeStackNavigationOptions = {
    presentation: 'modal',
    gestureEnabled: false,
    title: 'Profile'
}

export default function Settings() {
    const navigation = useNavigation();

    const user = useStore($user);
    const [phone, setPhone] = useState(user.phone ?? '');

    const mutation = useMutation({
        mutationFn: () => patchUser({ phone }),
        onSuccess: user => $user.set(user)
    });

    const settings = useStore($localSettings);
    const [mailboxNumber, setMailboxNumber] = useState(settings.mailboxNumber);
    const [mailboxCombination, setMailboxCombination] = useState(settings.mailboxCombination);
    const [macPass, setMacPass] = useState(settings.macPass);

    useEffect(() => { refreshUser() }, []);

    async function saveSettings() {
        $localSettings.setKey('macPass', macPass);
        $localSettings.setKey('mailboxNumber', mailboxNumber);
        $localSettings.setKey('mailboxCombination', mailboxCombination);

        await mutation.mutateAsync();

        navigation.goBack();
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
                        />
                    )}
                </HeaderButtons>
            )
        });
    }, [saveSettings, mutation.isLoading]);

    return (
        <>
            <StatusBar animated style="light"/>

            <ScrollView>
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
                                mask={Masks.USA_PHONE}
                                value={phone}
                                setValue={setPhone}
                                placeholder="(651) 696-6000"
                                maxLength={14}
                                inputMode="numeric"
                            />
                        </InputLabel>

                        <InputLabel text="MacPass Number">
                            <Input
                                placeholder="Scan or enter manually"
                                maxLength={9}
                                inputMode="numeric"
                                returnKeyType="done"
                                value={macPass}
                                setValue={setMacPass}
                            />

                            <TouchableOpacity
                                style={tw('absolute px-3 right-0 top-1.75')}
                                // @ts-expect-error
                                onPress={() => navigation.navigate('ScanMacPass', { setMacPass })}
                            >
                                <Ionicons name="camera" size={22} color={color('accent')}/>
                            </TouchableOpacity>
                        </InputLabel>

                        <Grid columns={2}>
                            <InputLabel text="Mailbox Number">
                                <Input
                                    placeholder="1605"
                                    maxLength={4}
                                    inputMode="numeric"
                                    returnKeyType="done"
                                    value={mailboxNumber}
                                    setValue={setMailboxNumber}
                                />
                            </InputLabel>

                            <InputLabel text="Mailbox Combination">
                                <Input
                                    mask={[/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                                    placeholder="33-05-27"
                                    maxLength={8}
                                    inputMode="decimal"
                                    returnKeyType="done"
                                    value={mailboxCombination}
                                    setValue={setMailboxCombination}
                                />
                            </InputLabel>
                        </Grid>
                    </Card>

                    <Button
                        text="Logout & Delete Local Data"
                        color="red"
                        onPress={logout}
                    />
                </View>
            </ScrollView>
        </>
    );
}