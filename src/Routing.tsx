import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useStore } from '@nanostores/react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw from './lib/tailwind';
import { $user } from './lib/user/user-store';
import * as ApproveNotifications from './screens/ApproveNotifications';
import * as Calendar from './screens/Calendar';
import * as CalendarDetail from './screens/CalendarDetail';
import * as Home from './screens/Home';
import * as Hours from './screens/Hours';
import * as LoginWall from './screens/LoginWall';
import * as Menus from './screens/Menus';
import * as Onboarding from './screens/Onboarding';
import * as ScanMacPass from './screens/ScanMacPass';
import * as Settings from './screens/Settings';
import * as ShowMacPass from './screens/ShowMacPass';
import * as ShowCombination from './screens/ShowCombination';
import * as Marketplace from './screens/marketplace/Marketplace';
import * as ListingDetail from './screens/marketplace/ListingDetail';
import * as EditListing from './screens/marketplace/EditListing';
import * as Feedback from './screens/Feedback';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

export default function Routing() {
    const user = useStore($user);

    let initialRoute = 'Tabs';
    if(user === null) initialRoute = 'Login';
    else if(user.position === null) initialRoute = 'Onboarding';

    return (
        <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen name="Login" component={LoginWall.default} options={LoginWall.screenOptions}/>
            <Stack.Screen name="ScanMacPass" component={ScanMacPass.default} options={ScanMacPass.screenOptions}/>
            <Stack.Screen name="Onboarding" component={Onboarding.default} options={Onboarding.screenOptions}/>
            <Stack.Screen name="Tabs" component={TabRouting} options={{ headerShown: false }}/>
        </Stack.Navigator>
    );
}

function TabRouting() {
    return (
        <Tabs.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
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
                name="MarketplaceTab"
                component={MarketplaceRouting}
                options={{
                    title: 'Marketplace',
                    // tabBarIcon: props => <Ionicons {...props} name="pricetag"/>
                    tabBarIcon: props => <FontAwesome5 {...props} name="comments-dollar"/>
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
            <Stack.Screen name="ShowCombination" component={ShowCombination.default} options={ShowCombination.screenOptions}/>
            <Stack.Screen name="Feedback" component={Feedback.default} options={Feedback.screenOptions}/>
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

function MarketplaceRouting() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Marketplace" component={Marketplace.default} options={Marketplace.screenOptions}/>
            <Stack.Screen name="ListingDetail" component={ListingDetail.default} options={ListingDetail.screenOptions}/>
            <Stack.Screen name="EditListing" component={EditListing.default} options={EditListing.screenOptions}/>
        </Stack.Navigator>
    );
}

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
            <Stack.Screen name="Feedback" component={Feedback.default} options={Feedback.screenOptions}/>
        </Stack.Navigator>
    );
}