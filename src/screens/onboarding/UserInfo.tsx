import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import Card from '../../components/Card';
import InputLabel from '../../components/InputLabel';
import PillRadioInput from '../../components/PillRadioInput';
import OnboardingShell from '../../components/onboarding/OnboardingShell';
import { patchUser } from '../../lib/api/api';
import { useForm } from '../../lib/hooks/use-form';
import tw from '../../lib/tailwind';
import { User } from '../../lib/types/user';
import { $user } from '../../lib/user/user-store';
import { getClassYears } from '../../lib/utils';

export default function UserInfo() {
    const navigation = useNavigation();

    const { fields, formData, isValid } = useForm(
        z.object({
            position: User.shape.position,
            class_year: User.shape.class_year.optional()
        })
    );

    const mutation = useMutation({
        mutationFn: () => patchUser(formData),
        onSuccess: newUser => {
            $user.set(newUser);
            // @ts-expect-error
            navigation.navigate('PhoneNumber');
        }
    });

    return (
        <OnboardingShell
            onPressPrimary={mutation.mutate}
            isPrimaryLoading={mutation.isLoading}
            isPrimaryValid={
                isValid && (
                    fields.position.value !== 'student' ||
                    Boolean(fields.class_year.value)
                )
            }
        >
            <Card style={tw('gap-3')}>
                <InputLabel text="What’s your position at Mac?">
                    <PillRadioInput
                        {...fields.position}
                        options={{
                            student: 'Student',
                            professor: 'Professor',
                            staff: 'Staff'
                        }}
                    />
                </InputLabel>

                {fields.position.value === 'student' && (
                    <InputLabel text="What’s your class year?">
                        <PillRadioInput
                            {...fields.class_year}
                            scroll={true}
                            options={getClassYears().map(String)}
                        />
                    </InputLabel>
                )}
            </Card>
        </OnboardingShell>
    );
}