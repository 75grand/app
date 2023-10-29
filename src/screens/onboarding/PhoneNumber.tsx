import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { Masks } from 'react-native-mask-input';
import { z } from 'zod';
import Card from '../../components/Card';
import Input from '../../components/Input';
import InputLabel from '../../components/InputLabel';
import OnboardingShell from '../../components/onboarding/OnboardingShell';
import { patchUser } from '../../lib/api/api';
import { useForm } from '../../lib/hooks/use-form';
import { User } from '../../lib/types/user';
import { $user } from '../../lib/user/user-store';
import { track } from '../../lib/api/analytics';

export default function PhoneNumber() {
    const navigation = useNavigation();

    const { fields, isValid, formData } = useForm(
        z.object({
            phone: User.shape.phone
        })
    );

    const mutation = useMutation({
        mutationFn: (phone: string) => patchUser({ phone }),
        onSuccess: user => $user.set(user)
    });

    async function handleNext() {
        await mutation.mutateAsync(formData.phone);

        // @ts-expect-error
        navigation.navigate('MacPassAndMailbox');
    }

    function handleSkip() {
        track('Onboarding: Tried to skip phone number');

        Alert.alert(
            'Are you sure?',
            'You’ll need to provide a phone number to use the marketplace and other functionality.',
            [
                {
                    isPreferred: true,
                    text: 'Add Number',
                    onPress: () => track('Onboarding: Reconsidered skipping phone number')
                },
                {
                    text: 'Continue Without',
                    onPress: () => {
                        track('Onboarding: Skipped phone number');
                        // @ts-expect-error
                        navigation.navigate('MacPassAndMailbox');
                    }
                }
            ]
        )
    }

    return (
        <OnboardingShell
            title="What’s your number?"
            isPrimaryValid={isValid}
            onPressPrimary={handleNext}
            isPrimaryLoading={mutation.isLoading}
            secondaryButtonText="Skip"
            onPressSecondary={handleSkip}
        >
            <Card>
                <InputLabel text="Phone Number">
                    <Input
                        {...fields.phone}
                        autoFocus
                        mask={Masks.USA_PHONE}
                        placeholder="(651) 696-6000"
                        maxLength={14}
                        inputMode="numeric"
                        returnKeyType="done"
                    />
                </InputLabel>
            </Card>
        </OnboardingShell>
    );
}