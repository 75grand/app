import { Platform, UIManager } from 'react-native';
import { registerAndroidNotifChannel, setNotifHandler, syncNotifToken } from './notifications';
import { loadTokenFromDisk } from './user/token-store';
import { loadUserFromDisk } from './user/user-store';
import { loadSettingsFromDisk } from './user/settings-store';

/**
 * Code that should run before the app loads. The splash screen will
 * wait for this code to execute before hiding.
 */
export async function boot(): Promise<true> {
    await loadTokenFromDisk();
    await loadUserFromDisk();
    await loadSettingsFromDisk();

    setNotifHandler();
    registerAndroidNotifChannel();
    await syncNotifToken();

    if(Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    return true;
}