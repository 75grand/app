import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';
import { Circle, G, Path, Svg, Text as SvgText } from 'react-native-svg';
import Button from '../components/Button';
import tw, { color, monospace } from '../helpers/tailwind';
import { $user } from '../helpers/user/user-store';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { useState } from 'react';

export const screenOptions: NativeStackNavigationOptions = {
    presentation: 'fullScreenModal',
    title: 'Mailbox Combination',
    headerShown: false
}

export default function ShowCombination() {
    const navigation = useNavigation();
    const maxNumber = 50;
    const degPerNum = 360/maxNumber;

    const { mailbox_combination, mailbox_number } = useStore($user);
    const [first, second, third] = mailbox_combination.split('-').map(s => Number(s));
    
    const [step, setStep] = useState(-1);
    const rotation = {
        0: -(360*4),
        1: -(360*4) + -(degPerNum*first),
        2: -(360*4) + -(degPerNum*first) + 360 + second + (degPerNum*first),
        3: -(360*4) + -(degPerNum*first) + 360 + second + (degPerNum*first),
        4: -(360*4) + -(degPerNum*first) + 360 + second + (degPerNum*first) + -(degPerNum*third)
    }[step] ?? 0;

    return (
        <>
            <StatusBar animated style="dark"/>

            <SafeAreaView>
                <View style={tw('p-8 h-full justify-between')}>
                    <View/>

                    <View style={tw('relative justify-center shadow-xl')}>
                        <MotiView
                            animate={{ rotate: `${rotation}deg` }}
                            transition={{
                                delay: 250,
                                type: 'timing',
                                duration: 5_000,
                                easing: Easing.linear
                            }}
                        >
                            <LockWheel max={maxNumber}/>
                        </MotiView>

                        <View style={tw('absolute w-32 h-32 border-2 border-gray-300 rounded-full self-center gap-0.5 justify-center')}>
                            <Text style={tw('text-lg text-center leading-none font-bold uppercase')}>Box</Text>
                            <Text style={tw('text-2xl text-center leading-none font-semibold')}>{mailbox_number}</Text>
                        </View>
                    </View>

                    <View/>

                    <View style={tw('gap-1')}>
                        <Text style={step === 0 && tw('text-accent font-bold')}>1. Turn the dial left at least four times</Text>
                        <Text style={step === 1 && tw('text-accent font-bold')}>2. Turn the dial left and stop at <Text style={tw('font-bold')}>{first}</Text></Text>
                        <Text style={step === 2 && tw('text-accent font-bold')}>3. Turn the dial right and pass <Text style={tw('font-bold')}>{first}</Text> once</Text>
                        <Text style={step === 3 && tw('text-accent font-bold')}>4. Stop at <Text style={tw('font-bold')}>{second}</Text></Text>
                        <Text style={step === 4 && tw('text-accent font-bold')}>5. Turn the dial left and stop at <Text style={tw('font-bold')}>{third}</Text></Text>
                        <Text style={step === 5 && tw('text-accent font-bold')}>6. Turn right and pull to open</Text>
                    </View>

                    <View/>

                    <Button text="Next" size="mega" onPress={() => setStep((step + 1) % 6)}/>
                    <Button text="Done" size="mega" onPress={navigation.goBack}/>
                </View>
            </SafeAreaView>
        </>
    );
}

function LockWheel({ max }: { max: number }) {
    const numberEvery = 5;

    const scale = 160;
    const tick = 5;

    return (
        <View style={{ aspectRatio: 1/1 }}>
            <Svg viewBox={`0 0 ${scale} ${scale}`} width="100%" height="100%">
                <Circle
                    r={scale/2 - 1/2}
                    cx={scale/2}
                    cy={scale/2}
                    fill={color('white')}
                    stroke={color('gray-300')}
                    strokeWidth={1}
                />

                {[...Array(max)].map((_, n) => {
                    return (
                        <G key={n} transform={`
                            rotate(${n/max * 360} ${scale/2} ${scale/2})
                            translate(0 -${scale/2 - tick})
                        `}>
                            <Path
                                d={
                                    n % numberEvery === 0
                                        ? `M ${scale/2} ${scale/2}, m 0 -${tick}, l 0 ${tick*2}`
                                        : `M ${scale/2} ${scale/2}, m 0 -${tick}, l 0 ${tick}`
                                }
                                stroke={color('gray-300')}
                                strokeWidth={1}
                            />

                            {n % numberEvery === 0 && <SvgText
                                x={scale/2}
                                y={scale/2}
                                dy={tick*4}
                                textAnchor="middle"
                                children={n}
                            />}
                        </G>
                    );
                })}
            </Svg>
        </View>
    );
}