import React, { Children, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import tw from '../lib/tailwind';

export interface Props {
    columns: 1|2|3|4,
    gap?: 0|1|2|3|4|8,
    children: React.ReactNode
}

export default function Grid({ columns, gap = 3, children }: Props) {
    const items = Children.toArray(children);

    const [width, setWidth] = useState(0);
    const gapSize = Number(tw(`gap-${gap}`).gap);
    const totalGap = gapSize * (columns - 1);

    function handleLayout({ nativeEvent }: LayoutChangeEvent) {
        setWidth(nativeEvent.layout.width);
    }

    return (
        <View onLayout={handleLayout} style={tw(`w-full flex-row flex-wrap gap-${gap}`)}>
            {items.map(item => {
                const itemWidth = (width - totalGap) / columns;

                return (
                    // @ts-expect-error
                    <View style={{ width: itemWidth }} key={item?.key ?? null}>
                        {item}
                    </View>
                );
            })}
        </View>
    );
}