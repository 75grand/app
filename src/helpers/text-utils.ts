export function pluralize(count: number, singular: string, plural?: string) {
    plural = plural ?? singular + 's';
    return count === 1 ? singular : plural;
}