import AsyncStorage from '@react-native-async-storage/async-storage';
import { map } from 'nanostores';

export const DEFAULT_SETTINGS = {
    macPass: '',
    mailboxNumber: '',
    mailboxCombination: '',
    mostUsedActions: {} as Record<string, number>,
    favoriteHours: ['Café Mac', 'The Grille', 'Mailroom', 'Library', 'ITS Help Desk', 'Leonard Center']
}

export const $localSettings = map<typeof DEFAULT_SETTINGS>();

(async () => {
    const json = await AsyncStorage.getItem('settings');
    const parsedSettings = json === null ? {} : JSON.parse(json);

    $localSettings.set({
        ...DEFAULT_SETTINGS,
        ...parsedSettings
    });
})();

$localSettings.listen(async settings => {
    const json = JSON.stringify(settings);
    await AsyncStorage.setItem('settings', json);
});