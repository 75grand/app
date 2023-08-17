import { Ionicons } from '@expo/vector-icons';
import { motifySvg } from 'moti/svg';
import { toWords } from 'number-to-words';
import { Linking, Platform, Share, Text, TouchableOpacity, View } from 'react-native';
import { Circle, Svg, Text as SvgText } from 'react-native-svg';
import tw, { color, monospace } from '../../lib/tailwind';
import { User } from '../../lib/types/user';
import Button from '../Button';
import InputLabel from '../InputLabel';

export default function ReferralCode({ referral_code, referrals_count, referrals_per_prize }: User) {
    async function shareReferral() {
        await Share.share({
            // url: 'https://www.75grand.net',
            message: `Download 75grand.net and use my referral code: ${referral_code}`
        });
    }

    return (
        <InputLabel text="Referrals">
            <View style={tw('flex-row gap-3')}>
                <ProgressCircle value={referrals_count} max={referrals_per_prize}/>

                <View style={tw('shrink gap-3')}>
                    <TouchableOpacity onPress={shareReferral} style={tw('self-start -mb-1.5 -mt-0.5')}>
                        <View style={tw('flex-row gap-2 items-center')}>
                            <Text selectable style={tw('leading-none text-base mt-1', { fontFamily: monospace })}>
                                {referral_code}
                            </Text>

                            <Ionicons name="share-outline" color={color('accent')} size={20}/>
                        </View>
                    </TouchableOpacity>

                    <Text>
                        Refer just {toWords(referrals_per_prize)} people for
                        a free drink from Sencha, Simplicitea, or Dunn Bros!
                    </Text>

                    {
                        referrals_count >= referrals_per_prize && (
                            <Button
                                text="Redeem Free Drink!"
                                onPress={() => {
                                    const message =
                                        encodeURIComponent(`Hey! I’ve referred ${referrals_per_prize} people and would like a drink from`);

                                    Linking.openURL(
                                        Platform.select({
                                            android: `sms:+15109444641?body=${message}`,
                                            ios: `sms:+15109444641&body=${message}`
                                        })
                                    );
                                }}
                            />
                        )
                    }
                </View>
            </View>
        </InputLabel>
    );
}

function ProgressCircle({ value, max }: { value: number, max: number }) {
    const scale = 100;
    const strokeWidth = scale/8;

    const percent = Math.min(value/max, 1);
    const radius = (scale/2) - (strokeWidth/2);
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percent*circumference);

    const MotiCircle = motifySvg(Circle)();

    return (
        <View style={tw('w-14', { aspectRatio: 1/1 })}>
            <Svg viewBox={`0 0 ${scale} ${scale}`} height="100%" width="100%">
                <SvgText
                    textAnchor="middle"
                    fontSize="40"
                    x={scale/2}
                    y={scale/2 + 15}
                >{value}</SvgText>

                <Circle
                    r={radius}
                    cx={scale/2} cy={scale/2}
                    strokeWidth={strokeWidth}
                    stroke={color('gray-200')}
                    fill="none"
                />

                {/* TODO: This animates from the start every time it's changed */}
                <MotiCircle
                    delay={500}
                    from={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    r={radius}
                    cx={scale/2} cy={scale/2}
                    stroke={color('accent')}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    transform={`rotate(-90 ${scale/2} ${scale/2})`}
                />
            </Svg>
        </View>
    );
}
