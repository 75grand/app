import { Text, View, Pressable, Linking, TouchableOpacity } from 'react-native';
import Card from '../Card';
import tw from '../../helpers/tailwind';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { decode } from 'html-entities';
import Grid from '../Grid';
import CardHeader from '../CardHeader';

async function fetchData() {
    const request = await fetch('https://api.reddit.com/r/macalester/hot.json?limit=5');
    const response = await request.json();
    return response.data.children.map(post => post.data);
}

export default function RedditCard() {
    const [items, setItems] = useState([]);
    useEffect(() => { fetchData().then(setItems) }, []);

    if(items.length === 0) return;

    return (
        <Card>
            <Pressable onPress={() => Linking.openURL('https://www.reddit.com/r/macalester')}>
                <CardHeader
                    title="r/Macalester"
                    subtitle={(items[0]?.subreddit_subscribers?.toLocaleString() ?? '???') + ' members'}
                    customIcon={() => <FontAwesome name="reddit" style={tw('text-[#FF4500]')} size={32}/>}
                />
            </Pressable>

            <Grid columns={1}>
                {items.map(RedditItem)}
            </Grid>
        </Card>
    );
}

function RedditItem({ id, title, score, author, permalink, num_comments, stickied }) {
    return (
        <TouchableOpacity key={id} onPress={() => Linking.openURL('https://www.reddit.com' + permalink)}>
            <View style={tw('flex gap-1')}>
                <Text numberOfLines={3}  style={tw('text-base font-semibold leading-tight')}>
                    {stickied && <MaterialIcons name="push-pin" style={tw('text-green')}/>}
                    {decode(title)}
                </Text>

                <View style={tw('flex items-center flex-row')}>
                    <Text style={tw('text-gray-500 mr-2')}>u/{author}</Text>
                    <MaterialCommunityIcons style={tw('text-gray-500 mr-0.5')} name="arrow-up"/>
                    <Text style={tw('text-gray-500 mr-2')}>{score.toLocaleString()}</Text>
                    <MaterialCommunityIcons style={tw('text-gray-500 mr-0.5')} name="comment-text-outline"/>
                    <Text style={tw('text-gray-500')}>{num_comments.toLocaleString()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}