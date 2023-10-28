import { Platform, UIManager } from 'react-native';
import { registerAndroidNotifChannel, setNotifHandler, syncNotifToken } from './notifications';
import { loadTokenFromDisk } from './user/token-store';
import { $user, loadUserFromDisk } from './user/user-store';
import { loadSettingsFromDisk } from './user/settings-store';
import { fetchUser } from './api/api';
import { HttpStatusCode } from 'axios';
import { isLoggedIn, logout } from './api/login';
import { migrateOldTasks } from './moodle-utils';

/**
 * Code that should run before the app loads. The splash screen will
 * wait for this code to execute before hiding.
 */
export async function boot(): Promise<true> {
    await loadTokenFromDisk();
    await loadUserFromDisk();
    await loadSettingsFromDisk();

    if(isLoggedIn()) {
        try {
            const user = await fetchUser();
            $user.set(user);

            // Migrate tasks to v1.1 system
            await migrateOldTasks();
        } catch(error) {
            if(error.response?.status === HttpStatusCode.Unauthorized) {
                logout();
            }
        }
    }

    setNotifHandler();
    registerAndroidNotifChannel();

    // This is async, but it should run in the background
    // https://github.com/expo/expo/issues/19648
    syncNotifToken();

    if(Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    return true;
}