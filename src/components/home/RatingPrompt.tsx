import { View } from 'react-native';
import tw from '../../lib/tailwind';
import Button from '../Button';
import Card from '../Card';
import CardHeader from '../CardHeader';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '@nanostores/react';
import { $user } from '../../lib/user/user-store';
import { $localSettings } from '../../lib/user/settings-store';
import * as StoreReview from 'expo-store-review';
import { useEffect, useState } from 'react';

export default function RatingPrompt() {
    const navigation = useNavigation();
    const user = useStore($user);
    const settings = useStore($localSettings);

    const [showReview, setShowReview] = useState(false);

    useEffect(() => {
        (async () => {
            setShowReview(
                user.created_at.diffNow().as('days') >= 3 &&
                !settings.hasLeftReviewOrFeedback &&
                await StoreReview.hasAction()
            );
        })();
    }, [user, settings]);

    if(!showReview) return;

    async function leaveReview() {
        await StoreReview.requestReview();
        $localSettings.setKey('hasLeftReviewOrFeedback', true);
    }

    function leaveFeedback() {
        // @ts-expect-error
        navigation.navigate('Feedback');
        $localSettings.setKey('hasLeftReviewOrFeedback', true);
    }

    return (
        <View style={tw('px-3')}>
            <Card style={tw('bg-accent')}>
                <CardHeader title="Enjoying 75grand so far?" icon="star" light={true}/>

                <View style={tw('flex-row gap-3')}>
                    <Button text="Yes, Leave a Review" color="light" onPress={leaveReview}/>
                    <Button text="No, Leave Feedback" color="faint-white" onPress={leaveFeedback}/>
                </View>
            </Card>
        </View>
    );
}