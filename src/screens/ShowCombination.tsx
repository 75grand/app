import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { MotiText, MotiView } from 'moti';
import { useCallback, useRef, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { Circle, G, Path, Svg, Text as SvgText } from 'react-native-svg';
import Button from '../components/Button';
import tw, { color } from '../helpers/tailwind';
import { $localSettings } from '../helpers/user/settings-store';

export const screenOptions: NativeStackNavigationOptions = {
    presentation: 'modal',
    title: 'Mailbox Combination',
    headerShown: false
}

export default function ShowCombination() {
    const navigation = useNavigation();
    
    const maxNumber = 50;
    const stepCount = 5;

    const { mailboxCombination, mailboxNumber } = useStore($localSettings);
    const first = Number(mailboxCombination.slice(0, 2));
    const second = Number(mailboxCombination.slice(2, 4));
    const third = Number(mailboxCombination.slice(4, 6));
    
    const [step, setStep] = useState(-1);

    const getRotation = useCallback((step: number) => {
        const degPerNum = 360/maxNumber;

        // - = to the left
        // + = to the right
        const number = {
            0: -(maxNumber*4), // Turn left four times
            1: -(maxNumber*4) -(first), // Stop at the first number
            2: -(maxNumber*4) -(first) +(maxNumber*2) +(first-second), // Turn right and pass the first number, stopping at the second
            3: -(maxNumber*4) -(first) +(maxNumber*2) +(first-second) -(third-second), // Turn left and stop at the third number
            4: -(maxNumber*4) -(first) +(maxNumber*2) +(first-second) -(third-second) // Turn right and pull to open
        }[step] ?? 0;
    
        return number * degPerNum;
    }, [first, second, third]);

    const prevRotation = useRef(0);
    const rotation = getRotation(step);
    const duration = Math.min(Math.max(Math.abs(prevRotation.current - rotation) * 5, 1000), 5000);
    prevRotation.current = rotation;

    return (
        <>
            <StatusBar animated style="light"/>

            <SafeAreaView>
                <View style={tw('p-8 h-full justify-between')}>
                    <View/>

                    <View style={tw('relative justify-center')}>
                        <MotiView
                            animate={{ rotate: `${rotation}deg` }}
                            transition={{
                                type: 'timing',
                                duration: duration,
                                easing: Easing.out(Easing.ease)
                            }}
                        >
                            <LockWheel max={maxNumber}/>
                        </MotiView>

                        <View style={tw('absolute w-32 h-32 border-2 border-gray-300 rounded-full self-center gap-0.5 justify-center')}>
                            <Text style={tw('text-lg text-center leading-none font-bold uppercase')}>Box</Text>
                            <Text style={tw('text-2xl text-center leading-none font-semibold')}>{mailboxNumber}</Text>
                        </View>
                    </View>

                    <View/>

                    <View style={tw('gap-1')}>
                        <Step isActive={step === 0}>1. Turn left at least four times</Step>
                        <Step isActive={step === 1}>2. Turn left and stop at <Text style={tw('font-bold')}>{first}</Text></Step>
                        <Step isActive={step === 2}>3. Turn right and pass <Text style={tw('font-bold')}>{first}</Text> once</Step>
                        <Step isActive={step === 2}>4. Stop at <Text style={tw('font-bold')}>{second}</Text></Step>
                        <Step isActive={step === 3}>5. Turn left and stop at <Text style={tw('font-bold')}>{third}</Text></Step>
                        <Step isActive={step === 4}>6. Turn right and pull to open</Step>
                    </View>

                    <View/>

                    {step < stepCount-1 && <Button text="Next" size="mega" onPress={() => setStep(step + 1)}/>}
                    {step === stepCount-1 && <Button text="Done" size="mega" onPress={navigation.goBack}/>}
                </View>
            </SafeAreaView>
        </>
    );
}

function Step({ isActive, children }: { isActive: boolean, children: React.ReactNode }) {
    const inactiveStyles = tw('leading-tight text-lg text-black');
    const activeStyles = tw('leading-tight text-accent text-xl');

    return (
        <MotiText
            from={inactiveStyles}
            animate={isActive && activeStyles}
            children={children}
        />
    );
}

function LockWheel({ max }: { max: number }) {
    const numberEvery = 5;

    const scale = 160;
    const tick = 5;

    return (
        <View style={tw('shadow-xl bg-white rounded-full', { aspectRatio: 1/1 })}>
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