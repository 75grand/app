import { Text, View } from 'react-native';
import { MenuItem } from '../../helpers/models/menu';
import Card from '../Card';
import CardHeader from '../CardHeader';
import Grid from '../Grid';
import DietaryRestrictions from './DietaryRestrictions';
import tw from '../../helpers/tailwind';

export default function MenuSection({ title, items }: { title: string, items: MenuItem[] }) {
    const icons = {
        Breakfast: 'cafe',
        Brunch: 'cafe',
        Lunch: 'sunny',
        Dinner: 'restaurant',
        'Late Night': 'moon'
    }

    return (
        <Card>
            <CardHeader title={title} icon={icons[title] ?? 'fast-food'}/>

            <Grid columns={1}>
                {items.map(item => {
                    return (
                        <View key={item.id} style={tw('flex gap-1')}>
                            <Text numberOfLines={3}  style={tw('text-base font-semibold leading-tight')}>{item.name}</Text>

                            <View style={tw('flex items-center flex-row gap-2')}>
                                <Text style={tw('text-gray-500')}>{item.station}</Text>
                                <DietaryRestrictions restrictions={item.dietary_restrictions}/>
                            </View>
                        </View>
                    );
                })}
            </Grid>
        </Card>
    );
}