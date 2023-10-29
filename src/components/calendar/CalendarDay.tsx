import { TouchableOpacity, View } from 'react-native';
import { CalendarEvent } from '../../lib/types/calendar';
import tw from '../../lib/tailwind';
import Card from '../Card';
import CardHeader from '../CardHeader';
import CalendarEventItem from './CalendarEventItem';
import { DateTime } from 'luxon';
import { useNavigation } from '@react-navigation/native';
import { track } from '../../lib/api/analytics';

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
                    {events.map((event, i) => {
                        function openEventDetails() {
                            track('Tapped a calendar event');

                            // @ts-expect-error
                            navigation.navigate('CalendarDetail', { event });
                        }

                        return (
                            <>
                                <TouchableOpacity onPress={openEventDetails} key={event.id}>
                                    <CalendarEventItem {...event}/>
                                </TouchableOpacity>

                                {i !== events.length-1 &&
                                    <View style={tw('bg-black/10 h-[0.5px]')}/>}
                            </>
                        );
                    })}
                </View>
            </Card>
        </View>
    );
}