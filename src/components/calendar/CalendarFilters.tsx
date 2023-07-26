import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { CalendarFilter } from '../../lib/calendar/filters';
import tw, { color } from '../../lib/tailwind';
import Pill from '../Pill';

interface Props {
    filters: CalendarFilter[],
    activeFilter: CalendarFilter,
    setActiveFilter: (filter: CalendarFilter) => void
}

export default function CalendarFilters({ filters, activeFilter, setActiveFilter }: Props) {
    return (
        <View style={tw('bg-white border-b border-black/10')}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <View style={tw('flex flex-row gap-2 p-3')}>
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
        </View>
    );
}