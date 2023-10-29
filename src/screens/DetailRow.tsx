import { Text, View } from 'react-native';
import tw from '../lib/tailwind';

export function DetailRow({ label, children }: { label: string; children: React.ReactNode; }) {
    return (
        <View style={tw('flex flex-row gap-4')}>
            <Text style={tw('text-base text-gray-500 w-16 text-right')}>{label}</Text>

            <View style={tw('shrink w-full')}>
                {children}
            </View>
        </View>
    );
}
