import { Linking, Text } from 'react-native';
import tw from '../lib/tailwind';

interface Props {
    href: string,
    children: React.ReactNode
}

export default function Link({ href, children }: Props) {
    return (
        <Text
            style={tw('text-accent font-semibold')}
            onPress={() => Linking.openURL(href)}
            children={children}
        />
    );
}