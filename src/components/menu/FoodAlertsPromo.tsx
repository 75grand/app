import { Text, View } from 'react-native';
import tw from '../../helpers/tailwind';
import Card from '../Card';
import CardHeader from '../CardHeader';
import Button from '../Button';
import { useNavigation } from '@react-navigation/native';

export default function FoodAlertsPromo({ onDismiss }: { onDismiss: () => void }) {
    const navigation = useNavigation();

    return (
        <Card style={tw('bg-accent flex')}>
            <CardHeader title="Favorite Food Alerts" icon="notifications" light={true}/>

            <Text style={tw('text-white text-base leading-snug mb-4')}>75grand can notify you when your favorite foods are served! Notifications will be delivered silently the night before.</Text>

            <View style={tw('flex flex-row gap-3')}>
                <Button onPress={() => navigation.navigate('HomeTab')} text="Add Favorite Foods" color="light"/>
                <Button onPress={onDismiss} text="Dismiss" color="faint-white"/>
            </View>
        </Card>
    );
}