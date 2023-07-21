import { Text } from 'react-native';
import OnboardingShell from '../../components/onboarding/OnboardingShell';
import tw from '../../helpers/tailwind';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/Card';
import InputLabel from '../../components/InputLabel';
import PillRadioInput from '../../components/PillRadioInput';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { patchUser } from '../../helpers/api/api';
import { $user } from '../../helpers/user/user-store';
import { User } from '../../helpers/models/user';
import { useStore } from '@nanostores/react';

export default function UserInfo() {
    const navigation = useNavigation();

    const [position, setPosition] = useState<string>();
    const [year, setYear] = useState<string>();

    const user = useStore($user);
    const firstName = user.name.split(' ')[0];

    const mutation = useMutation({
        mutationFn: () => patchUser({
            position: position as User['position'],
            class_year: Number(year)
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
            buttonText="Next"
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