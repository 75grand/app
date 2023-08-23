import { useNavigation } from '@react-navigation/native';
import OnboardingShell from '../../components/onboarding/OnboardingShell';

export default function MacPassAndMailbox() {
    const navigation = useNavigation();

    return (
        <OnboardingShell
            onPress={() => false}
            showBackButton={true}
        >

        </OnboardingShell>
    );
}