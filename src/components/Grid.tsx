import { Children } from 'react';
import { StyleProp, View } from 'react-native';
import tw from '../lib/tailwind';

export interface Props {
    columns: 1|2|3|4;
    gap?: 0|1|2|3|4|8;
    children: React.ReactNode;
    style?: StyleProp<any>;
}

export default function Grid({ columns, gap = 3, children, style = {} }: Props) {
    const childs = Children.toArray(children);

    return (
        <View style={tw(style, 'flex flex-row flex-wrap')}>
            {childs.map((child, index) => {
                const width = 100 / columns + '%';

                // Necessary for balaced columns
                const paddingLeft = index % columns !== 0 ? gap/2 : 0;
                const paddingRight = index % columns !== columns - 1 ? gap/2 : 0;

                const itemsInBottomRow = childs.length % columns || columns;
                const isInLastRow = index >= childs.length - itemsInBottomRow;
                const paddingBottom = isInLastRow ? 0 : gap;

                return (
                    <View style={tw('min-w-0', `pl-${paddingLeft} pr-${paddingRight} pb-${paddingBottom}`, { width })}
                        key={child['key'] ?? null}>{child}</View>
                )
            })}
        </View>
    )
}
