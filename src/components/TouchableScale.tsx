import { MotiPressable, MotiPressableProps } from 'moti/interactions';

export default function TouchableScale(props: MotiPressableProps) {
    return (
        <MotiPressable
            {...props}
            animate={({ pressed }) => {
                'worklet';

                return {
                    scale: pressed ? 0.96 : 1,
                    opacity: pressed ? 0.75 : 1
                }
            }}
        />
    );
}