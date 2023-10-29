import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Text } from 'react-native';
import OnboardingShell from '../../components/onboarding/OnboardingShell';
import tw from '../../lib/tailwind';
import { track } from '../../lib/api/analytics';

export default function ConfigureMoodle() {
    const navigation = useNavigation();

    function handleSetup() {
        track('Onboarding: Tapped configure Moodle');
        // @ts-expect-error
        navigation.navigate('MoodleSetup', { onSetupEnd: handleNext });
    }

    function handleNext() {
        track('Onboarding: Skipped configure Moodle');
        // @ts-expect-error
        navigation.navigate('BegForNotifications');
    }

    return (
        <OnboardingShell
            title="Moodle...on a phone?"
            primaryButtonText="Set Up Moodle"
            onPressPrimary={handleSetup}
            secondaryButtonText="Skip"
            onPressSecondary={handleNext}
        >
            <Text style={tw('text-base leading-tight px-2 text-center')}>
                75grand can show your Moodle assignments
                and remind you when they’re due.
            </Text>

            <Image
                source={require('../../../assets/moodle-sample.png')}
                style={tw('w-full', { aspectRatio: 954/626 })}
            />
        </OnboardingShell>
    );
}