import { Text, TextProps } from 'react-native';
import Link from './Link';

interface Props extends TextProps {
    text: string
}

export default function TextWithLinks({ text, ...props }: Props) {
    const body: React.ReactNode[] = [];
    const words = text.split(' ');

    for(const word of words) {
        if(!word.startsWith('http')) {
            body.push(word + ' ');
            continue;
        }

        try {
            new URL(word);
            body.push(<Link external href={word}>{word + ' '}</Link>);
        } catch {
            body.push(word + ' ');
        }
    }

    return <Text {...props}>{body}</Text>;
}