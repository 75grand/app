import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { DateTime } from 'luxon';
import { useLayoutEffect, useState } from 'react';
import { LayoutAnimation, Text, TouchableOpacity, View } from 'react-native';
import { fetchNews } from '../../lib/api/api';
import tw from '../../lib/tailwind';
import { NewsSources, NewsStory } from '../../lib/types/news';
import { openBrowser } from '../../lib/utils';
import Card from '../Card';
import CardHeader from '../CardHeader';
import Grid from '../Grid';
import PillRadioInput from '../PillRadioInput';
import TouchableScale from '../TouchableScale';

const sources = {
    'summit': 'Summit',
    'the-mac-weekly': 'The Mac Weekly',
    'the-hegemonocle': 'The Hegemonocle',
    'macalester': 'Macalester'
} satisfies Partial<Record<NewsSources, string>>;

const sourceUrls = {
    'summit': 'https://www.macalestersummit.com/',
    'the-mac-weekly': 'https://themacweekly.com/',
    'the-hegemonocle': 'https://macalesterhegemonocle.wordpress.com/',
    'macalester': 'https://www.macalester.edu/news/'
} satisfies typeof sources;

export default function NewsCard() {
    const [source, setSource] = useState<keyof typeof sources>('summit');

    useLayoutEffect(() => {
        LayoutAnimation
            .configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [source]);

    return (
        <View style={tw('px-3')}>
            <Card>
                <CardHeader
                    title="Campus News"
                    subtitle=""
                    icon="newspaper"
                />

                <View style={tw('gap-3')}>
                    <PillRadioInput
                        options={sources}
                        value={source}
                        setValue={(newSource: keyof typeof sources) => {
                            if(newSource === source) {
                                openBrowser(sourceUrls[source]);
                            } else {
                                setSource(newSource);
                            }
                        }}
                    />

                    {
                        source === 'the-hegemonocle' ? (
                            <HegemonocleIssues/>
                        ) : (
                            <NewsItems source={source}/>
                        )
                    }
                </View>
            </Card>
        </View>
    );
}

function NewsItems({ source }: { source: NewsSources }) {
    const { data = [] } = useQuery({
        queryFn: () => fetchNews(source),
        queryKey: ['news', source]
    });

    useLayoutEffect(() => {
        LayoutAnimation
            .configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [data]);

    if(data.length === 0) return;

    return (
        <Grid columns={1}>
            {data.map(story => <NewsItem key={story.url} source={source} {...story}/>)}
        </Grid>
    );
}

function NewsItem({ title, date, image_url, url, source }: NewsStory & { source: NewsSources }) {
    return (
        <TouchableOpacity onPress={() => openBrowser(url, { readerMode: source !== 'summit' })}>
            <View style={tw('gap-3 flex-row items-center')}>
                <View style={tw('gap-1 w-full shrink')}>
                    <Text numberOfLines={3}  style={tw('text-base font-semibold leading-tight')}>
                        {title}
                    </Text>

                    <Text style={tw('text-gray-500')}>
                        {date.toLocaleString(DateTime.DATE_FULL)}
                    </Text>
                </View>

                {image_url && (
                    <Image
                        source={image_url}
                        style={tw('w-16 h-16 bg-gray-200 rounded-lg')}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}

function HegemonocleIssues() {
    const { data = [] } = useQuery({
        queryFn: () => fetchNews('the-hegemonocle'),
        queryKey: ['news', 'the-hegemonocle']
    });

    useLayoutEffect(() => {
        LayoutAnimation
            .configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [data]);

    return (
        <Grid columns={3}>
            {data.map(issue => {
                return (
                    <TouchableScale key={issue.url} onPress={() => openBrowser(issue.url)}>
                        <Image
                            source={issue.image_url}
                            style={tw('bg-gray-300 rounded-lg', {
                                aspectRatio: 8.5/11
                            })}
                        />
                    </TouchableScale>
                );
            })}
        </Grid>
    );
}