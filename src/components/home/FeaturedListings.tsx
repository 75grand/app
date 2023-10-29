import { useQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';
import { fetchListings } from '../../lib/api/api';
import ListingItem from '../marketplace/ListingItem';
import tw from '../../lib/tailwind';

export default function FeaturedListings() {
    const { data } = useQuery({
        queryKey: ['listings'],
        queryFn: fetchListings,
        initialData: []
    });

    const listings = data.filter(a => a.available).slice(0, 5);

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={tw('flex-row gap-3 px-3')}>
                {listings.map(listing => {
                    return (
                        <View key={listing.id} style={tw('w-48')}>
                            <ListingItem isFeatured titleLines={1} {...listing}/>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}
