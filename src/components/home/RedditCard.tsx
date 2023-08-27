import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Linking, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { fetchRedditPosts } from '../../lib/api/api';
import tw from '../../lib/tailwind';
import { RedditPost } from '../../lib/types/news';
import { openBrowser } from '../../lib/utils';
import Card from '../Card';
import CardHeader from '../CardHeader';
import Grid from '../Grid';

export default function RedditCard() {
    const { data = [] } = useQuery({
        queryFn: fetchRedditPosts,
        queryKey: ['reddit']
    });

    if(data.length === 0) return;

    return (
        <Card>
            <Pressable onPress={() => Linking.openURL('https://www.reddit.com/r/macalester')}>
                <CardHeader
                    title="r/Macalester"
                    // subtitle={(items[0]?.subreddit_subscribers?.toLocaleString() ?? '???') + ' members'}
                    customIcon={props => <FontAwesome name="reddit" {...props}/>}
                />
            </Pressable>

            <Grid columns={1}>
                {data.map(post =>
                    <RedditItem key={post.url} {...post}/>)}
            </Grid>
        </Card>
    );
}

/* eslint-disable react/prop-types */
function RedditItem({ title, url, stickied, author, score, comments }: RedditPost) {
    return (
        <TouchableOpacity onPress={() => openBrowser(url)}>
            <View style={tw('flex gap-1')}>
                <Text numberOfLines={3}  style={tw('text-base font-semibold leading-tight')}>
                    {stickied && <MaterialIcons name="push-pin" style={tw('text-green')}/>}
                    {title}
                </Text>

                <View style={tw('flex items-center flex-row')}>
                    <Text style={tw('text-gray-500 mr-2')}>u/{author}</Text>
                    <MaterialCommunityIcons style={tw('text-gray-500 mr-0.5')} name="arrow-up"/>
                    <Text style={tw('text-gray-500 mr-2')}>{score.toLocaleString()}</Text>
                    <MaterialCommunityIcons style={tw('text-gray-500 mr-0.5')} name="comment-text-outline"/>
                    <Text style={tw('text-gray-500')}>{comments.toLocaleString()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
