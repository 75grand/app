import { useStore } from '@nanostores/react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLayoutEffect } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import { fetchListing } from '../../helpers/api/api';
import { Listing } from '../../helpers/models/marketplace';
import tw from '../../helpers/tailwind';
import { formatPhoneNumber, pluralize, ucFirst } from '../../helpers/text-utils';
import { $user } from '../../helpers/user/user-store';

export const screenOptions: NativeStackNavigationOptions = {
    headerTitle: () => <></>
}

export default function ListingDetail() {
    const navigation = useNavigation();
    const user = useStore($user);

    const params = useRoute().params as any;
    const listingId = params.listingId ?? params.listing.id;

    if(!listingId) return <EmptyState title="Listing not found" icon="pricetag"/>;

    const { data: listing } = useQuery<Listing>({
        queryKey: ['listings', listingId],
        queryFn: () => fetchListing(listingId),
        initialData: params.listing
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderButtons>
                    {listing?.user?.id === user.id && <Item
                        title="Edit"
                        onPress={() => {
                            // @ts-expect-error
                            navigation.navigate('EditListing', { listing });
                        }}
                    />}
                </HeaderButtons>
            )
        });
    }, [listing, user]);

    if(!listing) return;

    let metaText = listing.price === 0
        ? 'Free'
        : '$' + listing.price.toLocaleString();

    if(listing.miles_from_campus === 0) metaText += ' — On Campus';
    else if(listing.miles_from_campus === 9) metaText += ' — 5+ Miles Away';
    else metaText += ` — ${listing.miles_from_campus} ${pluralize(listing.miles_from_campus, 'mile')} from campus`;

    return (
        <>
            <ScrollView style={tw('h-full bg-white')}>
                <Pressable onLongPress={() => Linking.openURL(listing.image_url)}>
                    <Image source={listing.image_url}
                        style={tw('w-full border-b border-b-black/10', { aspectRatio: 1/1 })}/>
                </Pressable>

                <View style={tw('flex p-3 gap-3')}>
                    <Text selectable={true} style={tw('text-2xl font-bold')}>{listing.title}</Text>

                    <Text style={tw('text-accent text-base leading-none')}>{metaText}</Text>

                    <View style={tw('flex-row gap-3 items-center')}>
                        <Image source={listing.user.avatar}
                            style={tw('w-10 h-10 rounded-full bg-gray-200')}/>

                        <View>
                            <Text style={tw('text-base font-semibold')}>{listing.user.name}</Text>

                            <Text style={tw('text-gray-500')}>
                                {(
                                    listing.user.class_year
                                        ? `Class of ${listing.user.class_year}`
                                        : ucFirst(listing.user.position)
                                )}
                            </Text>
                        </View>
                    </View>

                    {listing.description &&
                        <Text style={tw('text-base')}>{listing.description}</Text>}
                </View>
            </ScrollView>

            <View style={tw('p-3 bg-white pt-0')}>
                <Button
                    text={'Text ' + formatPhoneNumber(listing.user.phone)}
                    size="mega"
                    onPress={() => Linking.openURL(`sms:${listing.user.phone}`)}
                />
            </View>
        </>
    );
}