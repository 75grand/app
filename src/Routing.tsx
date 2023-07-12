import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@nanostores/react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw from './helpers/tailwind';
import { $user } from './helpers/user/user-store';
import * as ApproveNotifications from './screens/ApproveNotifications';
import * as Calendar from './screens/Calendar';
import * as CalendarDetail from './screens/CalendarDetail';
import * as Home from './screens/Home';
import * as Hours from './screens/Hours';
import * as LoginWall from './screens/LoginWall';
// import * as Map from './screens/Map';
import * as Menus from './screens/Menus';
import * as ScanMacPass from './screens/ScanMacPass';
import * as Settings from './screens/Settings';
import * as ShowMacPass from './screens/ShowMacPass';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const initialRoute = 'MenusTab';

export default function Routing() {
    const user = useStore($user);

    if(user === null) {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginWall.default} options={LoginWall.screenOptions}/>
            </Stack.Navigator>
        );
    }

    return (
        <Tabs.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: tw('border-t border-t-black/10')
        }} initialRouteName={initialRoute}>
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

function HomeRouting() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home.default} options={Home.screenOptions}/>
            <Stack.Screen name="Settings" component={Settings.default} options={Settings.screenOptions}/>
            <Stack.Screen name="ScanMacPass" component={ScanMacPass.default} options={ScanMacPass.screenOptions}/>
            <Stack.Screen name="ShowMacPass" component={ShowMacPass.default} options={ShowMacPass.screenOptions}/>
        </Stack.Navigator>
    );
}

function CalendarRouting() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Calendar" component={Calendar.default} options={Calendar.screenOptions}/>
            <Stack.Screen name="CalendarDetail" component={CalendarDetail.default} options={CalendarDetail.screenOptions}/>
            <Stack.Screen name="ApproveNotifications" component={ApproveNotifications.default} options={ApproveNotifications.screenOptions}/>
        </Stack.Navigator>
    );
}

// function MapRouting() {
//     return (
//         <Stack.Navigator>
//             <Stack.Screen name="Map" component={Map.default} options={Map.screenOptions}/>
//         </Stack.Navigator>
//     );
// }

function MenusRouting() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Menus" component={Menus.default}/>
        </Stack.Navigator>
    );
}

function HoursRouting() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Hours" component={Hours.default} options={Hours.screenOptions}/>
        </Stack.Navigator>
    );
}