import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw, { color } from '../../lib/tailwind';
import Pill from '../Pill';
import { Ionicons } from '@expo/vector-icons';
import { CalendarFilter } from '../../lib/calendar-filters';

interface CalendarFiltersProps {
    filters: CalendarFilter[],
    activeFilter: CalendarFilter,
    setActiveFilter: (filter: CalendarFilter) => void
}

export default function CalendarFilters({ filters, activeFilter, setActiveFilter }: CalendarFiltersProps) {
    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={tw('flex flex-row gap-2 px-3')}>
                {filters.map(filter => {
                    return (
                        <TouchableOpacity onPress={() => setActiveFilter(activeFilter === filter ? null : filter)} key={filter.name}>
                            <Pill
                                active={filter === activeFilter}
                                text={filter.name}
                                tint={color(filter.tint)}
                                icon={props => <Ionicons {...props} name={filter.icon}/>}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}