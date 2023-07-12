import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import InputLabel from '../components/InputLabel';
import PillRadioInput from '../components/PillRadioInput';
import Profile from '../components/settings/Profile';
import { patchUser } from '../helpers/api/api';
import { logout } from '../helpers/api/login';
import { User } from '../helpers/models/user';
import tw, { color } from '../helpers/tailwind';
import { $user } from '../helpers/user/user-store';
import Grid from '../components/Grid';

export const screenOptions: NativeStackNavigationOptions = {
    presentation: 'modal',
    gestureEnabled: false,
    title: 'Profile'
}

export default function Settings() {
    const navigation = useNavigation();
    const user = useStore($user);

    const [year, setYear] = useState<string>(`${user.class_year ?? ''}`);
    const [position, setPosition] = useState<string>(user.position);
    const [mailboxNumber, setMailboxNumber] = useState<string>(`${user.mailbox_number ?? ''}`);
    const [mailboxCombination, setMailboxCombination] = useState<string>(user.mailbox_combination);
    const [macPass, setMacPass] = useState(user.macpass_number);

    const mutation = useMutation({
        mutationFn: () => patchUser({
            class_year: year ? Number(year) : null,
            position: position as User['position'],
            mailbox_number: mailboxNumber ? Number(mailboxNumber) : null,
            mailbox_combination: mailboxCombination as User['mailbox_combination'],
            macpass_number: macPass
        })
    });

    async function saveSettings() {
        const newUser = await mutation.mutateAsync();
        $user.set(newUser);
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
    }, [mutation.isLoading]);

    return (
        <>
            <StatusBar animated style="light"/>

            <ScrollView>
                <View style={tw('gap-3 p-3')}>
                    <Card>
                        <Profile {...user}/>
                    </Card>

                    <Card>
                        <InputLabel text="Referral Code">
                            <Text selectable style={tw('leading-none text-base self-start', { fontFamily: 'Menlo' })}>
                                {user.referral_code}
                            </Text>
                        </InputLabel>
                    </Card>

                    <Card style={tw('gap-3')}>
                        <InputLabel text="MacPass Number">
                            <Input
                                placeholder="Scan or enter manually"
                                maxLength={9}
                                inputMode="numeric"
                                returnKeyType="done"
                                value={macPass}
                                onChangeText={setMacPass}
                            />

                            <TouchableOpacity
                                style={tw('absolute px-3 right-0 top-1.75')}
                                // @ts-expect-error
                                onPress={() => navigation.navigate('ScanMacPass')}
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
                                    onChangeText={setMailboxNumber}
                                />
                            </InputLabel>

                            <InputLabel text="Mailbox Combination">
                                <Input
                                    placeholder="33-05-27"
                                    maxLength={8}
                                    keyboardType="numbers-and-punctuation"
                                    returnKeyType="done"
                                    value={mailboxCombination}
                                    onChangeText={setMailboxCombination}
                                />
                            </InputLabel>
                        </Grid>
                    </Card>

                    <Card style={tw('gap-3')}>
                        <InputLabel text="Position">
                            <PillRadioInput
                                setValue={setPosition}
                                value={position}
                                options={{
                                    student: 'Student',
                                    professor: 'Professor',
                                    staff: 'Staff'
                                }}
                            />
                        </InputLabel>

                        {position === 'student' && <InputLabel text="Graduation Year">
                            <PillRadioInput
                                setValue={setYear}
                                value={year}
                                scroll={true}
                                options={['2023', '2024', '2025', '2026', '2027']}
                            />
                        </InputLabel>}
                    </Card>

                    <Button text="Logout" color="red" onPress={logout}/>
                </View>
            </ScrollView>
        </>
    );
}