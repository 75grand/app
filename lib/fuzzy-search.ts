/**
 * Checks if all characters of the needle exist in order in the haystack
 * @param needle The search term
 * @param haystack The string to search against
 */
export default function fuzzySearch(needle: string, haystack: string): boolean {
    needle = needle.toLowerCase().replaceAll(' ', '');
    haystack = haystack.toLowerCase();

    for(let i = 0; i < haystack.length; i++) {
        if(haystack.charAt(i) === needle.charAt(0)) {
            needle = needle.slice(1);
        }

        if(needle.length === 0) {
            return true;
        }
    }

    return false;
}