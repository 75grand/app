import { Linking, Text } from 'react-native';
import tw from '../lib/tailwind';
import { openBrowser } from '../lib/utils';

interface Props {
    href: string,
    external?: boolean,
    children: React.ReactNode
}

export default function Link({ href, external = false, children }: Props) {
    function handlePress() {
        if(external) {
            Linking.openURL(href);
        } else {
            openBrowser(href);
        }
    }

    return (
        <Text
            style={tw('text-accent font-semibold')}
            onPress={handlePress}
            children={children}
        />
    );
}