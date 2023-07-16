import AsyncStorage from '@react-native-async-storage/async-storage';
import { map } from 'nanostores';

const DEFAULT_SETTINGS = {
    protectMacPass: false
}

export const $localSettings = map<typeof DEFAULT_SETTINGS>();

(async () => {
    const json = await AsyncStorage.getItem('user');
    const parsedSettings = json === null ? {} : JSON.parse(json);

    $localSettings.set({
        ...DEFAULT_SETTINGS,
        ...parsedSettings
    });
})();

$localSettings.listen(async user => {
    const json = JSON.stringify(user);
    await AsyncStorage.setItem('settings', json);
});