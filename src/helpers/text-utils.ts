export function pluralize(count: number, singular: string, plural?: string) {
    plural = plural ?? singular + 's';
    return count === 1 ? singular : plural;
}

export function ucFirst(string: string) {
    if(!string) return string;

    const first = string.charAt(0).toUpperCase();
    const rest = string.slice(1);

    return first + rest;
}

export function ucWords(string: string) {
    return string.split(' ').map(ucFirst).join(' ');
}