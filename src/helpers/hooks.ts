import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';

/**
 * Force a component to rerender on an aligned interval. For performance reasons,
 * use the largest value possible for your use case.
 * 
 * @param interval The interval, in ms, when the component should rerender
 */
export function useRerender(interval: number) {
    const [count, setCount] = useState(0);
    const isFocused = useIsFocused();

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        function loop() {
            const alignmentDelay = interval - (Date.now() % interval);
    
            timeout = setTimeout(() => {
                setCount(i => i+1);
                loop();
            }, alignmentDelay);
        }

        if(isFocused) {
            loop();
        } else {
            clearTimeout(timeout);
        }

        return () => clearTimeout(timeout);
    }, [interval, isFocused]);

    return count;
}

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