import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import tw from './helpers/tailwind';
import * as Calendar from './screens/Calendar';
import * as CalendarDetail from './screens/CalendarDetail';
import * as Home from './screens/Home';
import * as Hours from './screens/Hours';
import * as Menus from './screens/Menus';
import Settings from './screens/Settings';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

export default function Routing() {
    return (
        <Tabs.Navigator screenOptions={{
            headerShown: false,
            // tabBarShowLabel: false,
            tabBarStyle: tw('border-t border-t-black/10')
        }} initialRouteName="HomeTab">
            <Tabs.Screen
                name="HomeTab"
                component={HomeRouting}
                options={{
                    title: 'Home',
                    tabBarIcon: props => <Ionicons {...props} name="home"/>
                }}
            />

            <Tabs.Screen
                name="CalendarTab"
                component={CalendarRouting}
                options={{
                    title: 'Calendar',
                    tabBarIcon: props => <Ionicons {...props} name="calendar"/>
                }}
            />

            {/* <Tabs.Screen
                name="MapTab"
                component={MapRouting}
                options={{
                    title: 'Map',
                    tabBarIcon: props => <Ionicons {...props} name="map"/>
                }}
            /> */}

            <Tabs.Screen
                name="MenusTab"
                component={MenusRouting}
                options={{
                    title: 'Menus',
                    tabBarIcon: props => <Ionicons {...props} name="restaurant"/>
                }}
            />

            <Tabs.Screen
                name="HoursTab"
                component={HoursRouting}
                options={{
                    title: 'Hours',
                    tabBarIcon: props => <Ionicons {...props} name="time"/>
                }}
            />
        </Tabs.Navigator>
    );
}

const stackOptions: NativeStackNavigationOptions = {
    headerShadowVisible: false,
    headerBackground: () => <View style={tw('bg-white w-full h-full border-b border-b-black/10')}/>
}

function HomeRouting() {
    return (
        <Stack.Navigator screenOptions={stackOptions}>
            <Stack.Screen name="Home" component={Home.default} options={Home.screenOptions}/>
            <Stack.Screen name="Settings" component={Settings}/>
        </Stack.Navigator>
    );
}

function CalendarRouting() {
    return (
        <Stack.Navigator screenOptions={stackOptions}>
            <Stack.Screen name="Calendar" component={Calendar.default} options={Calendar.screenOptions}/>
            <Stack.Screen name="CalendarDetail" component={CalendarDetail.default} options={CalendarDetail.screenOptions}/>
        </Stack.Navigator>
    );
}

// function MapRouting() {
//     return (
//         <Stack.Navigator screenOptions={stackOptions}>
//             <Stack.Screen name="Map" component={Map.default}/>
//         </Stack.Navigator>
//     );
// }

function MenusRouting() {
    return (
        <Stack.Navigator screenOptions={stackOptions}>
            <Stack.Screen name="Menus" component={Menus.default}/>
        </Stack.Navigator>
    );
}

function HoursRouting() {
    return (
        <Stack.Navigator screenOptions={stackOptions}>
            <Stack.Screen name="Hours" component={Hours.default}/>
        </Stack.Navigator>
    );
}