import { TouchableOpacity, View } from 'react-native';
import { CalendarEvent } from '../../helpers/models/calendar';
import tw from '../../helpers/tailwind';
import Card from '../Card';
import CardHeader from '../CardHeader';
import CalendarEventItem from './CalendarEventItem';
import { DateTime } from 'luxon';
import { useNavigation } from '@react-navigation/native';

interface Props {
    date: DateTime,
    events: CalendarEvent[],
    index?: number
}

export default function CalendarDay({ date, events, index }: Props) {
    const navigation = useNavigation();
    const dateText = date.toLocaleString({ weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <View style={tw('m-3', index > 0 && 'mt-0')}>
            <Card>
                <CardHeader title={dateText}/>

                <View style={tw('gap-3')}>
                    {events.map(event => {
                        function openEventDetails() {
                            // @ts-expect-error
                            navigation.navigate('CalendarDetail', { event });
                        }

                        return (
                            <TouchableOpacity onPress={openEventDetails} key={event.id}>
                                <CalendarEventItem {...event}/>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Card>
        </View>
    );
}