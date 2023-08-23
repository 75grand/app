import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';
import { z } from 'zod';
import Card from '../../components/Card';
import InputLabel from '../../components/InputLabel';
import OnboardingShell from '../../components/onboarding/OnboardingShell';
import MacPassInput from '../../components/settings/MacPassInput';
import MailboxInput from '../../components/settings/MailboxInput';
import { useForm } from '../../lib/hooks/use-form';
import tw from '../../lib/tailwind';
import { zMacPass, zMailboxCombination } from '../../lib/types/utils';
import { $localSettings } from '../../lib/user/settings-store';
import { $user } from '../../lib/user/user-store';

export default function MacPassAndMailbox() {
    const navigation = useNavigation();

    const user = useStore($user);

    const { fields, formData, isValid } = useForm(
        z.object({
            macPass: zMacPass,
            mailboxCombination: zMailboxCombination,
            mailboxNumber: z.string().optional()
        })
    );

    function handleNext() {
        $localSettings.setKey('macPass', formData.macPass);
        $localSettings.setKey('mailboxNumber', formData.mailboxNumber);
        $localSettings.setKey('mailboxCombination', formData.mailboxCombination);

        if(user.position === 'student') {
            // @ts-expect-error
            navigation.navigate('ConfigureMoodle');
        } else {
            // @ts-expect-error
            navigation.navigate('BegForNotifications');
        }
    }

    return (
        <OnboardingShell
            onPressPrimary={handleNext}
            isPrimaryValid={isValid}
            onPressSecondary={navigation.goBack}
        >
            <Text style={tw('text-base leading-tight px-2 text-center')}>
                {user.position === 'student' ? (
                    '75grand can remember your MacPass number, mailbox number, and mailbox combination for you. They’ll be stored securely and will never leave your device.'
                ) : (
                    '75grand can remember your MacPass number for you. It will be stored securely and will never leave your device.'
                )}
            </Text>
    
            <Card style={tw('gap-3')}>
                <InputLabel text="MacPass Number">
                    <MacPassInput {...fields.macPass}/>
                </InputLabel>
    
                {user.position === 'student' && (
                    <MailboxInput
                        mailboxNumber={fields.mailboxNumber.value}
                        setMailboxNumber={fields.mailboxNumber.setValue}
                        mailboxCombination={fields.mailboxCombination.value}
                        setMailboxCombination={fields.mailboxCombination.setValue}
                    />
                )}
            </Card>
        </OnboardingShell>
    );
}