import { View } from 'moti';
import { Text } from 'react-native';
import tw, { color } from '../../lib/tailwind';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';

export default function MoodlePermissionGrant({ onAllow, onDeny }: { onAllow: () => void, onDeny: () => void }) {
    return (
        <View style={tw('p-3 gap-6')}>
            <Text style={tw('text-3xl font-semibold')}>Allow 75grand to{'\n'}access Moodle?</Text>

            <View>
                <Text style={tw('text-lg font-semibold')}>75grand will be able to:</Text>
                <BulletItem text="See your assignments" checkmark={true}/>
            </View>

            <View>
                <Text style={tw('text-lg font-semibold')}>75grand will not be able to:</Text>
                <BulletItem text="See your submissions" checkmark={false}/>
                <BulletItem text="See your grades" checkmark={false}/>
                <BulletItem text="Access your Macalester account" checkmark={false}/>
                <BulletItem text="See your classmates" checkmark={false}/>
            </View>

            <View style={tw('gap-3')}>
                <Button onPress={onAllow} text="Allow" size="mega"/>
                <Button onPress={onDeny} text="Deny" color="gray"/>
            </View>
        </View>
    );
}

function BulletItem({ text, checkmark }: { text: string, checkmark: boolean }) {
    return (
        <View style={tw('flex-row items-center gap-2')}>
            <Ionicons
                name={checkmark ? 'checkmark-circle' : 'close-circle'}
                color={color(checkmark ? 'green' : 'red')}
                size={16}
            />

            <Text style={tw('text-lg')}>{text}</Text>
        </View>
    );
}