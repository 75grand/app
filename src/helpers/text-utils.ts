export function pluralize(count: number, singular: string, plural?: string) {
    plural = plural ?? singular + 's';
    return count === 1 ? singular : plural;
}

export function formatPhoneNumber(digits: number|string) {
    const string = String(digits);

    const areaCode = string.substring(0, 3);
    const firstThree = string.substring(3, 6);
    const lastFour = string.substring(6, 10);

    return `(${areaCode}) ${firstThree}-${lastFour}`;
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