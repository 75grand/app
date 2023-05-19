import { SectionList, Text, View } from 'react-native';
import tw from '../lib/tailwind';
import Card from './Card';
import { TouchableOpacity } from 'react-native-gesture-handler';

export type DataItem = { label: string, value?: any };

interface CategoryListProps {
    data: { [key: string]: DataItem[] },
    onItemPress: (item: DataItem) => void,
    renderText?: (item: DataItem) => React.ReactElement
}

export default function CategoryList({ data, onItemPress, renderText }: CategoryListProps) {
    const transformedData = Object.entries(data).map(entry => {
        return {
            title: entry[0],
            data: entry[1]
        }
    });
    
    return (
        <SectionList
            initialNumToRender={30}
            sections={transformedData}
            keyExtractor={(item, index) => item.label + index}
            renderItem={item => renderItem(item.item, onItemPress, renderText)}
            renderSectionHeader={renderSectionHeader}
        />
    );
}

function renderItem(item: DataItem, onPress: CategoryListProps['onItemPress'], renderText: CategoryListProps['renderText']) {
    return (
        <View style={tw('bg-white border-b border-black/10')}>
            <TouchableOpacity onPress={() => onPress(item)} style={tw('px-6 py-2')}>
                {renderText ? renderText(item) : <Text numberOfLines={1} style={tw('text-base')}>{item.label}</Text>}
            </TouchableOpacity>
        </View>
    );
}

function renderSectionHeader({ section: { title } }) {
    return (
        <View style={tw('bg-gray-100 border-b border-black/10 px-3 py-1')}>
            <Text numberOfLines={1} style={tw('text-base font-semibold')}>{title}</Text>
        </View>
    );
}