import { Alert, TouchableOpacity, View } from 'react-native';
import { DietaryRestriction } from '../../lib/types/menu';
import tw from '../../lib/tailwind';
import { Image } from 'expo-image';
import { track } from '../../lib/api/analytics';

export default function DietaryRestrictions({ restrictions }: { restrictions: DietaryRestriction[] }) {
    function handlePress(restriction: DietaryRestriction) {
        track('Tapped dietary restriction', { name: restriction.label });
        Alert.alert(restriction.label, restriction.description);
    }

    return (
        <View style={tw('flex flex-row gap-2 items-center')}>
            {restrictions.map(restriction => {
                return (
                    <TouchableOpacity key={restriction.label} style={tw('w-4')} onPress={() => handlePress(restriction)}>
                        <Image source={restriction.image_url} style={tw('aspect-square rounded-full bg-black/5')}/>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}