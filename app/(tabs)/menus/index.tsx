import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Grid from '../../../src/components/Grid';
import FoodAlertsPromo from '../../../src/components/menu/FoodAlertsPromo';
import MenuSection from '../../../src/components/menu/MenuSection';
import { GET } from '../../../src/helpers/api/http';
import tw, { color } from '../../../src/helpers/tailwind';
import { Menu } from '../../../src/helpers/models/menu';
import FutureMenuWarning from '../../../src/components/menu/FutureMenuWarning';
import EmptyState from '../../../src/components/EmptyState';

export default function() {
    const [showPromo, setShowPromo] = useState(true);
    const [date, setDate] = useState(DateTime.now());
    const [showPicker, setShowPicker] = useState(false);
    const [menu, setMenu] = useState({} as Menu);
    const [refreshing, setRefreshing] = useState(false);

    const refreshControl = (
        <RefreshControl
            onRefresh={() => {
                setRefreshing(true);

                GET<Menu>('menu/' + date.toISODate())
                    .then(setMenu)
                    .catch(() => {})
                    .finally(() => setRefreshing(false));
            }}
            refreshing={refreshing}
            colors={[color('accent')]}
        />
    );

    useEffect(() => {
        setMenu({});
        setRefreshing(true);

        GET('menu/' + date.toISODate())
            .then(setMenu)
            .catch(() => {})
            .finally(() => setRefreshing(false));
    }, [date]);

    function onConfirmDate(newDate: Date) {
        setDate(DateTime.fromJSDate(newDate));
        setShowPicker(false);
    }

    return (
        <>
            <Stack.Screen options={{
                title: 'Menu',
                headerTitle: () => (
                    <>
                        <Text style={tw('text-[17px] font-semibold')}>Menu for </Text>

                        <TouchableOpacity style={tw('flex flex-row items-center gap-0.5')} onPress={() => setShowPicker(true)}>
                            <Text style={tw('text-accent text-[17px] font-semibold')}>{date.toLocaleString(DateTime.DATE_FULL)}</Text>
                            <Ionicons size={16} color={color('accent')} name="chevron-down"/>
                        </TouchableOpacity>
                    </>
                )
            }}/>

            <DateTimePickerModal
                isVisible={showPicker}
                date={date.toJSDate()}
                buttonTextColorIOS={color('accent')}
                mode="date"
                display="inline"
                themeVariant="light"
                minimumDate={DateTime.fromObject({ year: 2012, month: 3, day: 18 }).toJSDate()}
                maximumDate={DateTime.now().plus({ days: 3 }).toJSDate()}
                accentColor={color('accent')}
                onCancel={() => setShowPicker(false)}
                onConfirm={onConfirmDate}
            />

            <SafeAreaView>
                <ScrollView style={tw('h-full')} refreshControl={refreshControl}>
                    <Grid columns={1} style={tw('p-3')}>
                        {date.startOf('day') > DateTime.now().startOf('day') && <FutureMenuWarning/>}
                        {showPromo && <FoodAlertsPromo onDismiss={() => setShowPromo(false)}/>}
                        {(!refreshing && Object.entries(menu).length === 0) && <EmptyState title="No Menu Found" subtitle="Try another date" icon="fast-food"/>}
                        {Object.entries(menu).map(([title, items]) => <MenuSection key={title} title={title} items={items}/>)}
                    </Grid>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}