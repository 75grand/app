import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import tw from '../lib/tailwind';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
]);

export function screenOptions({ navigation }): NativeStackNavigationOptions {
    return {
        presentation: 'modal',
        title: 'Scan MacPass',
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

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            if(status === 'denied') navigation.goBack();
        })();
    }, []);

    function handleScan({ data }) {
        if(data.length === 9) {
            setMacPass(data);
            navigation.goBack();
        }
    }

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