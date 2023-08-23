import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Text } from 'react-native';
import Card from '../../components/Card';
import InputLabel from '../../components/InputLabel';
import PillRadioInput from '../../components/PillRadioInput';
import OnboardingShell from '../../components/onboarding/OnboardingShell';
import { patchUser } from '../../lib/api/api';
import { User } from '../../lib/types/user';
import tw from '../../lib/tailwind';
import { $user } from '../../lib/user/user-store';

export default function UserInfo() {
    const navigation = useNavigation();

    const [position, setPosition] = useState<string>();
    const [year, setYear] = useState<string>();

    const user = useStore($user);
    const firstName = user.name.split(' ')[0];

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

    return (
        <OnboardingShell
            title={<>Welcome, <Text style={tw('text-accent')}>{firstName}</Text>!</>}
            onPress={mutation.mutate}
            isLoading={mutation.isLoading}
            isValid={Boolean(position && (position === 'student' ? year : true))}
        >
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
        </OnboardingShell>
    );
}