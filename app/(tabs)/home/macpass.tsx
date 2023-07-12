import { BarCodeScanner } from 'expo-barcode-scanner';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Button from '../../../src/components/Button';
import tw from '../../../src/helpers/tailwind';

export default function macpass() {
    const [hasPermission, setHasPermission] = useState(false);
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    function handleScan({ data }) {
        if(data.length === 9) {
            setStudentId(data);
        }
    }

    return (
        <>
            <Stack.Screen options={{ title: 'MacPass' }}/>

            <View>
                {!hasPermission && <Text>Please allow access to your camera</Text>}
                {studentId && <Text>MacPass ID: {studentId}</Text>}

                {(hasPermission && !studentId) && <BarCodeScanner
                    onBarCodeScanned={handleScan}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.codabar]}
                    style={tw('w-full h-full')}
                />}

                <Button text="Scan Again" onPress={() => setStudentId(null)}/>
            </View>
        </>
    );
}