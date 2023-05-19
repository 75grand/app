import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { View, ScrollView, Text, TouchableOpacity, Linking } from 'react-native';
import tw from '../../lib/tailwind';
import Pill from '../Pill';
import { useRouter } from 'expo-router';

export default function QuickAccess() {
    const router = useRouter();

    const items = [
        ['Clock In/Out', 'time', () => Linking.openURL('https://cas.tcplusondemand.com/43341/App_Redirect/webclock.aspx')],
        ['PO Box Code', 'lock-open', () => alert('Implement me!')],
        ['Moodle', 'school', () => Linking.openURL('https://moodle.macalester.edu/login/index.php?authCAS=CAS')],
        ['Reserve Room', 'business', () => alert('Implement me!')],
        ['Printing & Scanning', 'print', () => Linking.openURL('https://macalester.us.uniflowonline.com/#StartPrinting/')],
        ['Catalog', 'book', () => Linking.openURL('https://www.macalester.edu/library/')],
    ].map(item => {
        return {
            name: item[0] as string,
            icon: item[1] as any,
            action: item[2] as () => void
        }
    });

    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={tw('flex flex-row gap-2 px-3')}>
                {items.map(item => {
                    return (
                        <TouchableOpacity key={item.name} onPress={item.action}>
                            <Pill
                                text={item.name}
                                icon={props => <Ionicons {...props} name={item.icon}/>}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}