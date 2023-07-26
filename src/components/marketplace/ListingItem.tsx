import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from '../../lib/tailwind';
import Card from '../Card';
import { Listing } from '../../lib/models/marketplace';
import { getCdnUrl } from '../../lib/utils';

export default function ListingItem(listing: Listing & { titleLines?: number }) {
    const { id, title, image_url, available, price, miles_from_campus } = listing;
    const navigation = useNavigation();

    let metaText = price === 0 ? 'Free' : '$' + price.toLocaleString();
    if(miles_from_campus > 0) metaText += ' (Off Campus)';

    function handlePress() {
        // @ts-expect-error
        navigation.navigate('ListingDetail', { listingId: id, listing });
    }

    return (
        <TouchableOpacity onPress={handlePress}>
            <Card style={tw('p-0')}>
                <View style={tw(available || 'opacity-30')}>
                    <Image source={getCdnUrl(image_url, 500, 500)}
                        style={tw('w-full', { aspectRatio: 1 })}/>

                    <View style={tw('p-3 pt-2 gap-2 border-t border-t-black/10')}>
                        <Text style={tw('leading-tight text-base font-semibold')} numberOfLines={listing.titleLines ?? 3}>{title}</Text>
                        <Text style={tw('leading-none text-sm text-accent')}>{metaText}</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
}