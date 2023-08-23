import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, LogBox, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import tw from '../lib/tailwind';
import { zMacPass } from '../lib/types/utils';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
]);

export function screenOptions({ navigation }): NativeStackNavigationOptions {
    return {
        presentation: 'modal',
        title: 'Scan Barcode',
        headerShown: true,
        headerLeft: () => (
            <HeaderButtons left>
                <Item title="Cancel" onPress={navigation.goBack}/>
            </HeaderButtons>
        )
    }
}

export default function ScanMacPass() {
    const navigation = useNavigation();
    const { setMacPass } = useRoute().params as any;

    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();

            if(status === 'denied') {
                Alert.alert(
                    'Camera permissions required',
                    'Please allow access to your camera to scan your MacPass'
                );
                navigation.goBack();
            } else {
                setHasPermission(true);
            }
        })();
    }, []);

    function handleScan({ data }) {
        if(zMacPass.safeParse(data).success) {
            setMacPass(data);
            navigation.goBack();
        }
    }

    if(!hasPermission) return;

    return (
        <>
            <StatusBar animated style="light"/>

            <View>
                <BarCodeScanner
                    onBarCodeScanned={handleScan}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.codabar]}
                    style={tw('w-full h-full')}
                />
            </View>
        </>
    );
}