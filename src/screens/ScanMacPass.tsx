import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { patchUser } from '../helpers/api/api';
import tw from '../helpers/tailwind';
import { $user } from '../helpers/user/user-store';

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
    
    const mutation = useMutation({
        mutationFn: (id: string) => patchUser({ macpass_number: id })
    });

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            if(status === 'denied') navigation.goBack();
        })();
    }, []);

    function handleScan({ data }) {
        if(data.length === 9) {
            $user.setKey('macpass_number', data);
            mutation.mutate(data);
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