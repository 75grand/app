import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import Grid from '../components/Grid';
import Input from '../components/Input';
import InputLabel from '../components/InputLabel';
import Logo from '../components/Logo';
import PillRadioInput from '../components/PillRadioInput';
import MacPassInput from '../components/macpass/MacPassInput';
import { patchUser } from '../lib/api/api';
import tw from '../lib/tailwind';
import { User } from '../lib/types/user';
import { $localSettings } from '../lib/user/settings-store';
import { $user } from '../lib/user/user-store';

export const screenOptions: NativeStackNavigationOptions = {
    title: 'Finish Signing Up',
    presentation: 'fullScreenModal',
    animation: 'flip',
    headerShown: false
}

export default function Onboarding() {
    const navigation = useNavigation();

    const settings = useStore($localSettings);
    const user = useStore($user);
    const firstName = user.name.split(' ')[0];

    const [position, setPosition] = useState<string>();
    const [year, setYear] = useState<string>();

    const valid = Boolean(position && (position === 'student' ? year : true));

    const mutation = useMutation({
        mutationFn: () => patchUser({
            position: position as User['position'],
            class_year: year
        }),
        onSuccess: newUser => {
            $user.set(newUser);
            // @ts-expect-error
            navigation.navigate('Tabs');
        }
    });

    const [stepIndex, setStepIndex] = useState(0);
    const steps = [<StepOne key="one"/>, <StepTwo key="two"/>];
    const step = steps[stepIndex];

    const result =  (
        <>
            <StatusBar animated style="dark"/>

            <SafeAreaView style={tw('h-full bg-white')}>
                <View style={tw('p-6 bg-white h-full justify-between')}>
                    <View style={tw('gap-12 items-center')}>
                        <Logo/>

                        <Text style={tw('text-3xl font-bold text-center')}>
                            Welcome, <Text style={tw('text-accent')}>{firstName}</Text>!
                        </Text>

                        <View style={tw('w-full gap-6')}>
                            {step}
                        </View>
                    </View>

                    <Button
                        text="Next"
                        size="mega"
                        loading={mutation.isLoading}
                        disabled={!valid}
                        onPress={() => {
                            if(stepIndex === steps.length-1) {
                                mutation.mutate();
                            } else {
                                setStepIndex(stepIndex + 1);
                            }
                        }
                    }/>
                </View>
            </SafeAreaView>
        </>
    );

    function StepOne() {
        return (
            <>
                <Card style={tw('gap-3')}>
                    <InputLabel text="What’s your position at Mac?">
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

                    {position === 'student' && <InputLabel text="What’s your class year?">
                        <PillRadioInput
                            setValue={setYear}
                            value={year}
                            scroll={true}
                            options={['2023', '2024', '2025', '2026', '2027']}
                        />
                    </InputLabel>}
                </Card>
            </>
        );
    }

    function StepTwo() {
        return (
            <>
                <Text style={tw('text-base leading-tight px-2 text-center')}>
                    {position === 'student' ? (
                        '75grand can remember your MacPass number, mailbox number, and mailbox combination for you. They’ll be stored securely on your device.'
                    ) : (
                        '75grand can remember your MacPass number for you. It will be stored securely on your device.'
                    )}
                </Text>
        
                <Card style={tw('gap-3')}>
                    <InputLabel text="MacPass Number">
                        <MacPassInput
                            value={settings.macPass}
                            setValue={value => $localSettings.setKey('macPass', value)}
                        />
                    </InputLabel>
        
                    {position === 'student' && <Grid columns={2}>
                        <InputLabel text="Mailbox Number">
                            <Input
                                placeholder="1605"
                                maxLength={4}
                                inputMode="numeric"
                                returnKeyType="done"
                                value={settings.mailboxNumber}
                                setValue={value => $localSettings.setKey('mailboxNumber', value)}
                            />
                        </InputLabel>
        
                        <InputLabel text="Mailbox Combination">
                            <Input
                                placeholder="33-05-27"
                                maxLength={8}
                                mask={[/[0-4]/, /\d/, '-', /[0-4]/, /\d/, '-', /[0-4]/, /\d/]}
                                keyboardType="numbers-and-punctuation"
                                returnKeyType="done"
                                value={settings.mailboxCombination}
                                setValue={value => $localSettings.setKey('mailboxCombination', value)}
                            />
                        </InputLabel>
                    </Grid>}
                </Card>
            </>
        );
    }

    return result;
}