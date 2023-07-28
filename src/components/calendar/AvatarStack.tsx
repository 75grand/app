import { Image } from 'expo-image';
import { View } from 'react-native';
import tw from '../../lib/tailwind';

interface Props {
    avatars: string[],
    count?: number
}

export default function AvatarStack({ avatars, count = 0 }: Props) {
    count = Math.min(count, 5);
    avatars = avatars?.slice(0, 5);

    const styles = tw('w-8 h-8 bg-gray-200 rounded-full');

    return (
        <View style={tw('flex flex-row', { columnGap: -12 })}>
            {avatars.length > 0 ? avatars.map(src => {
                return <Image key={src} source={src} style={styles}/>;
            }) : [...Array(count)].map(() => {
              /* eslint-disable react/jsx-key */
              return <View style={styles}/>;
            })}
        </View>
    );
}
