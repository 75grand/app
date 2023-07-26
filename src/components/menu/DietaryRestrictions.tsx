import { Alert, TouchableOpacity, View } from 'react-native';
import { DietaryRestriction } from '../../lib/models/menu';
import tw from '../../lib/tailwind';
import { Image } from 'expo-image';

export default function DietaryRestrictions({ restrictions }: { restrictions: DietaryRestriction[] }) {
    return (
        <View style={tw('flex flex-row gap-2 items-center')}>
            {restrictions.map(({ label, description, image_url }) => {
                return (
                    <TouchableOpacity key={label} style={tw('w-4')} onPress={() => Alert.alert(label, description)}>
                        <Image source={image_url} style={tw('aspect-square rounded-full bg-black/5')}/>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}