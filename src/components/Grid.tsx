import React, { Children } from 'react';
import { View } from 'react-native';
import tw from '../lib/tailwind';

export interface Props {
    columns: 1|2|3|4,
    gap?: 0|1|2|3|4|8,
    children: React.ReactNode
}

export default function Grid({ columns, gap = 3, children }: Props) {
    const items = Children.toArray(children);

    const rows: (typeof items[0])[][] = [];

    for(let i = 0; i < items.length; i += columns) {
        const row = items.slice(i, i + columns);

        rows.push([
            ...row,
            ...Array(columns - row.length).map(index => <View key={index}/>)
        ]);
    }

    return (
        <View style={tw(`gap-${gap}`)}>
            {rows.map((row, index) => (
                <View key={index} style={tw(`flex-row gap-${gap}`)}>
                    {row.map(item => (
                        <View
                            // @ts-expect-error
                            key={item?.key ?? null}
                            style={tw('w-full shrink')}
                            children={item}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
}
