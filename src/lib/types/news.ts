import { z } from 'zod';
import { zDateTime } from './utils';

export type NewsSources = 'the-mac-weekly'|'macalester'|'the-hegemonocle'|'summit';

export type NewsStory = z.infer<typeof NewsStory>;
export const NewsStory = z.object({
    title: z.string(),
    date: zDateTime,
    image_url: z.string().url().nullable(),
    url: z.string().url()
});

export type RedditPost = z.infer<typeof RedditPost>;
export const RedditPost = NewsStory.and(
    z.object({
        image_url: z.null(),
        author: z.string(),
        comments: z.number(),
        score: z.number(),
        stickied: z.boolean()
    })
);