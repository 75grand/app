import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import CategoryList, { DataItem } from '../../../src/components/CategoryList';
import Input from '../../../src/components/Input';
import fuzzySearch from '../../../src/helpers/fuzzy-search';
import tw, { color } from '../../../src/helpers/tailwind';
import Button from '../../../src/components/Button';
import * as Haptics from 'expo-haptics';

export default function() {
    const data = {
        Popular: [
            { label: 'Pepperoni Pizza', value: 'pepperoni-pizza' },
            { label: 'Cheeseburger', value: 'cheeseburger' },
            { label: 'California Roll', value: 'california-roll' },
            { label: 'Carnitas Tacos', value: 'carnitas-tacos' }
        ]
    };

    const [filteredData, setFilteredData] = useState(data);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const dataCopy = data;

        for(const key in dataCopy) {
            dataCopy[key] = dataCopy[key].filter(item => {
                return fuzzySearch(query, item.label) || fuzzySearch(query, item.value);
            });

            if(dataCopy[key].length === 0) {
                delete dataCopy[key];
            }
        }

        setFilteredData(data);
    }, [query]);

    function handlePress(item: DataItem) {
        Haptics.selectionAsync();
        const index = selected.indexOf(item.value);
        
        if(index === -1) {
            setSelected([...selected, item.value]);
        } else {
            delete selected[index];
            setSelected([...selected]);
        }
    }

    function renderText(item: DataItem) {
        return (
            <View style={tw('flex flex-row gap-3 justify-between items-center')}>
                <Text numberOfLines={1} style={tw('text-base')}>{item.label}</Text>
                {selected.includes(item.value) && <Ionicons size={20} color={color('accent')} name="checkmark"/>}
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{
                title: 'Choose Foods',
                headerRight: () => <Button text="Save"/>
            }}/>

            <View style={tw('p-3')}>
                <Input search={true} onChangeText={setQuery} placeholder="Search..."/>
            </View>

            <CategoryList
                data={filteredData}
                onItemPress={handlePress}
                renderText={renderText}
            />
        </>
    );
}