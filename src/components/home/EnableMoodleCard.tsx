import { FontAwesome5 } from '@expo/vector-icons';
import { View } from 'moti';
import { Text } from 'react-native';
import tw from '../../lib/tailwind';
import Card from '../Card';
import CardHeader from '../CardHeader';

export default function EnableMoodleCard({ children }: { children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader
                title="Moodle"
                customIcon={props => <FontAwesome5 name="graduation-cap" {...props}/>}
            />

            <View style={tw('gap-3 -mt-1')}>
                <Text style={tw('text-base')}>
                    75grand can display your Moodle assignments and
                    remind you before they're due.
                </Text>

                {children}

                <Text style={tw('text-xs text-gray-500')}>
                    Notifications will be sent when the assignment is due
                    and at 9:00 AM the day before.
                    
                    This feature does not store your login credentials
                    and was not developed by Moodle or ITS.
                </Text>
            </View>
        </Card>
    );
}