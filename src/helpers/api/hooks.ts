import { useState } from 'react';

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