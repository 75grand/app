import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { MasonryFlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { View } from 'react-native';
import EmptyState from '../../components/EmptyState';
import FloatingCircleButton from '../../components/FloatingCircleButton';
import ListingItem from '../../components/marketplace/ListingItem';
import { fetchListings } from '../../helpers/api/api';
import { useTanStackRefresh } from '../../helpers/api/hooks';
import tw from '../../helpers/tailwind';
import { useNavigation } from '@react-navigation/native';

export const screenOptions: NativeStackNavigationOptions = {
    headerLargeTitle: true
}

export default function Marketplace() {
    const navigation = useNavigation();

    const { data: listings, isFetching, refetch } = useQuery({
        queryKey: ['listings'],
        queryFn: fetchListings,
        placeholderData: []
    });

    const { fixedRefetch, isRefetching } = useTanStackRefresh(refetch);

    function createListing() {
        // @ts-expect-error
        navigation.navigate('EditListing');
    }

    return (
        <>
            <FloatingCircleButton
                icon="add"
                onPress={createListing}
            />

            <MasonryFlashList
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={tw('p-1.5')}
                onRefresh={fixedRefetch}
                refreshing={isRefetching}
                data={[...listings]}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                ListEmptyComponent={!isFetching && <EmptyState
                    icon="sad-outline"
                    title="No Listings Found"
                    subtitle="Be the first to post one!"
                />}
                renderItem={({ item }) => (
                    <View key={item.id} style={tw('p-1.5')}>
                        <ListingItem {...item}/>
                    </View>
                )}
                estimatedItemSize={211}
            />
        </>
    );
}