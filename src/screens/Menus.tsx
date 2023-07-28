import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { useLayoutEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import EmptyState from '../components/EmptyState';
import Grid from '../components/Grid';
import FutureMenuWarning from '../components/menu/FutureMenuWarning';
import MenuSection from '../components/menu/MenuSection';
import { fetchMenu } from '../lib/api/api';
import { useTanStackRefresh } from '../lib/hooks';
import tw, { color } from '../lib/tailwind';
import { Menu } from '../lib/types/menu';

export default function Menus() {
    const navigation = useNavigation();

    const [date, setDate] = useState(DateTime.now());
    const [showPicker, setShowPicker] = useState(false);
    
    const { data: menu, isError, refetch } = useQuery<Menu>({
        queryKey: ['menu', date.toSQLDate()],
        queryFn: async () => await fetchMenu(date),
        placeholderData: {}
    });

    const { fixedRefetch, isRefetching } = useTanStackRefresh(refetch);
    const refreshControl = <RefreshControl
        refreshing={isRefetching}
        onRefresh={fixedRefetch}
    />;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <>
                    <Text style={tw('text-[17px] font-semibold')}>Menu for </Text>
    
                    <TouchableOpacity style={tw('flex flex-row items-center gap-0.5')} onPress={() => setShowPicker(true)}>
                        <Text style={tw('text-accent text-[17px] font-semibold')}>{date.toLocaleString(DateTime.DATE_FULL)}</Text>
                        <Ionicons size={16} color={color('accent')} name="chevron-down"/>
                    </TouchableOpacity>
                </>
            )
        });
    }, [date]);

    function handleConfirmDate(newDate: Date) {
        setDate(DateTime.fromJSDate(newDate));
        setShowPicker(false);
    }

    return (
        <>
            <DateTimePickerModal
                isVisible={showPicker}
                date={date.toJSDate()}
                buttonTextColorIOS={color('accent')}
                mode="date"
                display="inline"
                themeVariant="light"
                minimumDate={DateTime.fromISO('2012-03-18').toJSDate()}
                maximumDate={DateTime.now().plus({ days: 3 }).toJSDate()}
                accentColor={color('accent')}
                onCancel={() => setShowPicker(false)}
                onConfirm={handleConfirmDate}
            />

            <SafeAreaView>
                <ScrollView style={tw('h-full')} refreshControl={refreshControl}>
                    <Grid columns={1} style={tw('p-3')}>
                        {date.startOf('day') > DateTime.now().startOf('day') && <FutureMenuWarning/>}
                        {/* {showPromo && <FoodAlertsPromo onDismiss={() => setShowPromo(false)}/>} */}
                        {(isError || !menu) && <EmptyState title="No Menu Found" subtitle="Try another date" icon="fast-food"/>}
                        {menu && Object.entries(menu).map(([title, items]) => <MenuSection key={title} title={title} items={items}/>)}
                    </Grid>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}