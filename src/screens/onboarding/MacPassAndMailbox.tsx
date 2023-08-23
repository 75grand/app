import { useNavigation } from '@react-navigation/native';
import OnboardingShell from '../../components/onboarding/OnboardingShell';
import InputLabel from '../../components/InputLabel';
import MacPassInput from '../../components/macpass/MacPassInput';
import { useForm } from '../../lib/hooks/use-form';
import { z } from 'zod';
import { User } from '../../lib/types/user';
import { zMacPass } from '../../lib/types/utils';

export default function MacPassAndMailbox() {
    const navigation = useNavigation();

    const { fields } = useForm(
        z.object({
            macPass: zMacPass
        })
    );

    function handleNext() {

    }

    return (
        <OnboardingShell onPress={handleNext} showBackButton>
            <InputLabel text="MacPass Number">
                <MacPassInput {...fields.macPass}/>
            </InputLabel>
        </OnboardingShell>
    );
}