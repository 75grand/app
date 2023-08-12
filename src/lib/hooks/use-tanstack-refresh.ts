import { useState } from 'react';

/**
 * @see https://github.com/TanStack/query/issues/2380
 */

export function useTanStackRefresh(refetch: () => Promise<unknown>) {
    const [isRefetching, setIsRefetching] = useState(false);

    async function fixedRefetch() {
        setIsRefetching(true);

        try {
            await refetch();
        } finally {
            setIsRefetching(false);
        }
    }

    return {
        isRefetching,
        fixedRefetch
    };
}
