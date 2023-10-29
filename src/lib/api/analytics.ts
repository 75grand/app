import { Analytics as June, type TrackParams } from '@june-so/analytics-node';
import { $user } from '../user/user-store';

const analytics = new June('p1ig93HqchBORPo2', {
    disable: __DEV__,
    flushInterval: 5_000,
    maxEventsInBatch: 5
});

export function track(event: string, properties: TrackParams['properties'] = {}) {
    analytics.track({
        event,
        userId: $user.get().id.toString(),
        properties
    });
}

$user.subscribe(async user => {
    if(user !== null) {
        analytics.identify({
            userId: String(user.id),
            traits: {
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.created_at.toJSDate(),
                position: user.position
            }
        });
    }
});