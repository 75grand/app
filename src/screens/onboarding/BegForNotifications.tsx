import { Text, View } from 'react-native';
import NotificationSellingPoints from '../../components/onboarding/NotificationSellingPoints';
import OnboardingShell from '../../components/onboarding/OnboardingShell';
import tw from '../../lib/tailwind';
import { useState } from 'react';
import { askForNotifPermission } from '../../lib/notifications';
import { StackActions, useNavigation } from '@react-navigation/native';

export default function BegForNotifications() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
 
    async function handleAccept() {
        setIsLoading(true);
        await askForNotifPermission();
        setIsLoading(false);
        handleSkip();
    }

    function handleSkip() {
        navigation.dispatch(
            StackActions.replace('Tabs')
        );
    }

    return (
        <OnboardingShell
            title={<Title/>}
            primaryButtonText="Enable Notifications"
            onPressPrimary={handleAccept}
            isPrimaryLoading={isLoading}
            secondaryButtonText="Maybe Later"
            onPressSecondary={handleSkip}
        >
            <View style={tw('p-3')}>
                <NotificationSellingPoints/>
            </View>
        </OnboardingShell>
    );
}

function Title() {
    return (
        <>
            Get the most{'\n'}out of <Text style={tw('text-accent')}>Macalester</Text>
        </>
    );
}