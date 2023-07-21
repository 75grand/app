import { useEffect, useState } from 'react';

interface Props {
    seconds: number,
    children: React.ReactNode
}

export default function Rerender({ seconds, children }: Props) {
    const [,setState] = useState(0);

    useEffect(() => {
        const delay = (60 - new Date().getSeconds()) % seconds;

        let timing = setTimeout(() => {
            setState(i => i++);

            timing = setInterval(() => {
                setState(i => i++);
            }, seconds*1000);
        }, delay);

        // clearInterval and clearTimeout are the same
        return () => clearInterval(timing);
    }, []);

    return children;
}