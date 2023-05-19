import { Text, View } from 'react-native';
import tw from '../../lib/tailwind';
import Card from '../Card';
import CardHeader from '../CardHeader';
import Button from '../Button';
import { useRouter } from 'expo-router';

export default function FoodAlertsPromo({ onDismiss }: { onDismiss: () => void }) {
    const router = useRouter();

    return (
        <Card style={tw('bg-accent flex')}>
            <CardHeader title="Favorite Food Alerts" icon="notifications" light={true}/>

            <Text style={tw('text-white text-base leading-snug mb-4')}>75grand can notify you when your favorite foods are served! Notifications will be delivered silently at 7:00 AM.</Text>

            <View style={tw('flex flex-row gap-3')}>
                <Button onPress={() => router.push('/menus/food-alerts')} text="Add Favorite Foods" color="light"/>
                <Button onPress={onDismiss} text="Dismiss" color="faint"/>
            </View>
        </Card>
    );
}