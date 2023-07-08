import { Text } from 'react-native';
import tw from '../../helpers/tailwind';
import Card from '../Card';
import CardHeader from '../CardHeader';

export default function FutureMenuWarning() {
    return (
        <Card style={tw('bg-red')}>
            <CardHeader title="Back to the Future" icon="play-forward" light={true}/>
            <Text style={tw('text-white text-base leading-snug')}>You're previewing an upcoming menu that might change before it's implemented. You've been warned, time traveler.</Text>
        </Card>
    );
}