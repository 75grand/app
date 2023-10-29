import { useStore } from '@nanostores/react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLayoutEffect } from 'react';
import { Linking, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import { fetchListing } from '../../lib/api/api';
import { Listing } from '../../lib/types/marketplace';
import tw from '../../lib/tailwind';
import { formatPhoneNumber, ucFirst } from '../../lib/text-utils';
import { $user } from '../../lib/user/user-store';
import { getCdnUrl, openBrowser } from '../../lib/utils';
import { formatDistance } from '../../lib/marketplace-utils';
import UserItem from '../../components/UserItem';
import { SITE } from '../../lib/constants';
import { Ionicons } from '@expo/vector-icons';
import { track } from '../../lib/api/analytics';

export const screenOptions: NativeStackNavigationOptions = {
    headerTitle: () => <></>
}

export default function ListingDetail() {
    const navigation = useNavigation();
    const user = useStore($user);

    const params = useRoute().params as any;
    const listingId = params.listingId ?? params.listing.id;

    if(!listingId) return <EmptyState title="Listing not found" icon="pricetag"/>;

    const { data: listing, isLoading } = useQuery<Listing>({
        queryKey: ['listings', listingId],
        queryFn: () => fetchListing(listingId),
        initialData: params.listing
    });

    function handleShare() {
        track('Shared listing', { listingId: listing.id });
        const url = `${SITE}/marketplace/${listing.id}`;
        Share.share({ url });
    }

    function handleImagePress() {
        track('Tapped listing image');
        openBrowser(listing.image_url);
    }

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

                    <Item
                        title="Share Event"
                        IconComponent={Ionicons}
                        iconSize={25}
                        iconName="share-outline"
                        onPress={handleShare}
                    />
                </HeaderButtons>
            )
        });
    }, [listing, user]);

    if(!listing && isLoading) return;
    if(!listing) return <EmptyState title="Listing not found" icon="pricetag"/>;

    const priceText = listing.price === 0
        ? 'Free'
        : '$' + listing.price.toLocaleString();

    return (
        <>
            <ScrollView style={tw('h-full bg-white')}>
                <Pressable onPress={handleImagePress}>
                    <Image source={getCdnUrl(listing.image_url, 1000, 1000)}
                        style={tw('w-full border-b border-b-black/10', { aspectRatio: 1/1 })}/>
                </Pressable>

                <View style={tw('flex p-3 gap-3')}>
                    <Text selectable={true} style={tw('text-2xl font-bold')}>{listing.title}</Text>

                    <Text style={tw('text-accent text-base leading-none')}>
                        {priceText} • {formatDistance(listing.miles_from_campus)}
                    </Text>

                    <UserItem
                        name={listing.user.name}
                        avatar={listing.user.avatar}
                        subtitle={listing.user.class_year ? `Class of ${listing.user.class_year}` : ucFirst(listing.user.position)}
                    />

                    {listing.description &&
                        <Text style={tw('text-base')}>{listing.description}</Text>}
                </View>
            </ScrollView>

            <View style={tw('p-3 bg-white pt-0')}>
                {listing.available ? (
                    listing.user.phone ? (
                        <Button
                            text={`Text ${formatPhoneNumber(listing.user.phone)}`}
                            size="mega"
                            onPress={() => Linking.openURL(`sms:${listing.user.phone}`)}
                        />
                    ) : (
                        <Button
                            text={`Email ${listing.user.email}`}
                            size="mega"
                            onPress={() => Linking.openURL(`mailto:${listing.user.email}`)}
                        />
                    )
                ) : (
                    <Button
                        text="No Longer Available"
                        size="mega"
                        color="faint-red"
                        onPress={() => navigation.goBack()}
                    />
                )}
            </View>
        </>
    );
}