import { Ionicons } from '@expo/vector-icons';
import { motifySvg } from 'moti/svg';
import { Share, Text, TouchableOpacity, View } from 'react-native';
import { Circle, Svg, Text as SvgText } from 'react-native-svg';
import { User } from '../../helpers/models/user';
import tw, { color } from '../../helpers/tailwind';
import InputLabel from '../InputLabel';
import { toWords } from 'number-to-words';

export default function ReferralCode({ referral_code, referrals_count }: User) {
    const nextPrize = 5;
    const numberLeft = Math.max(nextPrize - referrals_count ?? 0, 0);

    async function shareReferral() {
        await Share.share({
            // url: 'https://www.75grand.net',
            message: `Download 75grand.net and use my referral code: ${referral_code}`
        });
    }

    return (
        <InputLabel text="Referrals">
            <View style={tw('flex-row gap-3')}>
                <ProgressCircle value={referrals_count} max={nextPrize}/>

                <View style={tw('shrink gap-1')}>
                    <TouchableOpacity onPress={shareReferral} style={tw('-mt-1.5')}>
                        <View style={tw('flex-row gap-2 items-center')}>
                            <Text selectable style={tw('leading-none text-base mt-1', { fontFamily: 'Menlo' })}>
                                {referral_code}
                            </Text>

                            <Ionicons name="share-outline" color={color('accent')} size={20}/>
                        </View>
                    </TouchableOpacity>

                    <Text>
                        Refer just {toWords(numberLeft)} people for
                        a free drink from Sencha, Simplicitea, or Dunn Bros!
                    </Text>
                </View>
            </View>
        </InputLabel>
    );
}

function ProgressCircle({ value, max }: { value: number, max: number }) {
    const base = 100;
    const strokeWidth = base/8;
    
    const percent = Math.min(value/max, 1);
    const radius = (base/2) - (strokeWidth/2);
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percent*circumference);

    const MotiCircle = motifySvg(Circle)();

    return (
        <View style={{ aspectRatio: 1/1 }}>
            <Svg viewBox={`0 0 ${base} ${base}`} height="100%" width="100%">
                <SvgText
                    textAnchor="middle"
                    fontSize="40"
                    x={base/2}
                    y={base/2 + 15}
                >{value}</SvgText>

                <Circle
                    r={radius}
                    cx={base/2} cy={base/2}
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
                    cx={base/2} cy={base/2}
                    stroke={color('accent')}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    transform={`rotate(-90 ${base/2} ${base/2})`}
                />
            </Svg>
        </View>
    );
}