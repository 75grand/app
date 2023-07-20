import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { fetchHours } from '../../helpers/api/api';
import tw from '../../helpers/tailwind';
import Card from '../Card';
import Grid, { Props as GridProps } from '../Grid';
import HoursItem from './HoursItem';
import Button from '../Button';
import { useNavigation } from '@react-navigation/native';

interface Props {
    columns?: GridProps['columns'],
    maxItems?: number
}

export default function HoursCard({ columns = 2, maxItems }: Props) {
    const navigation = useNavigation();

    const { data } = useQuery({
        queryKey: ['hours'],
        queryFn: fetchHours,
        placeholderData: []
    });

    const [,setDate] = useState(new Date);

    useEffect(() => {
        const interval = 5;
        const initialDelay = (60 - new Date().getSeconds()) % interval * 1000;

        let timing = setTimeout(() => {
            setDate(new Date);
            timing = setInterval(() => {
                setDate(new Date);
            }, interval*1000);
        }, initialDelay);

        // clearInterval and clearTimeout are the same
        return () => clearInterval(timing);
    }, []);

    return (
        <Card>
            <Grid columns={columns}>
                {data.slice(0, maxItems).map(service => (
                    <HoursItem
                        key={service.name}
                        name={service.name}
                        events={service.events} />
                ))}

                {maxItems && <Button
                    // @ts-expect-error
                    onPress={() => navigation.navigate('HoursTab')}
                    color="gray" text="More Hours"
                />}
            </Grid>
        </Card>
    );
}