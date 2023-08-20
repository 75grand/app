import { Platform, UIManager } from 'react-native';
import { registerAndroidNotifChannel, setNotifHandler, syncNotifToken } from './notifications';
import { loadTokenFromDisk } from './user/token-store';
import { $user, loadUserFromDisk } from './user/user-store';
import { loadSettingsFromDisk } from './user/settings-store';
import { fetchUser } from './api/api';
import { HttpStatusCode } from 'axios';
import { logout } from './api/login';

/**
 * Code that should run before the app loads. The splash screen will
 * wait for this code to execute before hiding.
 */
export async function boot(): Promise<true> {
    await loadTokenFromDisk();
    await loadUserFromDisk();
    await loadSettingsFromDisk();

    try {
        const user = await fetchUser();
        $user.set(user);
    } catch(error) {
        if(error.response?.status === HttpStatusCode.Unauthorized) {
            await logout();
        }
    }

    setNotifHandler();
    registerAndroidNotifChannel();
    await syncNotifToken();

    if(Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    return true;
}