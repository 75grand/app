import { MotiView } from 'moti';
import { View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import Svg, { Circle, Defs, Text, TextPath } from 'react-native-svg';
import tw from '../lib/tailwind';

interface Props {
    text: string,
    color?: string,
    children: React.ReactNode
}

export default function AnimatedRing({ text, color = 'white', children }: Props) {
    return (
        <View style={tw('h-48 relative items-center justify-center')}>
            <View style={tw('w-32 h-32')}>
                {children}
            </View>

            <MotiView
                style={tw('absolute w-48 h-48')}
                from={{ rotate: '0deg' }}
                animate={{ rotate: '360deg' }}
                transition={{
                    loop: true,
                    type: 'timing',
                    duration: 15_000,
                    easing: Easing.linear,
                    repeatReverse: false
                }}
            >
                <TextRing text={text} color={color}/>
            </MotiView>
        </View>
    );
}

function TextRing({ text, color }: { text: Props['text'], color: Props['color'] }) {
    return (
        <Svg viewBox="0 0 100 100">
            <Defs>
                <Circle id="circle" fill="red" r="37" cx="50" cy="50"/>
            </Defs>

            <Text fill={color} fontSize="8">
                <TextPath href="#circle" textLength="300">
                    {text.toUpperCase()}
                </TextPath>
            </Text>
        </Svg>
    );
}