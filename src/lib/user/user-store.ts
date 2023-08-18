import AsyncStorage from '@react-native-async-storage/async-storage';
import { map } from 'nanostores';
import { User } from '../types/user';
import { refreshUser } from '../api/login';

export const $user = map<User>(null);

// Load currently saved user
(async () => {
    const json = await AsyncStorage.getItem('user');
    if(json === null) return;
    
    const parsedJson = JSON.parse(json);
    if(parsedJson === null) return;

    const parsedUser = await User.safeParseAsync(parsedJson);

    if(parsedUser.success === true) {
        $user.set(parsedUser.data);
    } else {
        await refreshUser();
    }
})();

// Save the user when it changes
$user.listen(async user => {
    const json = JSON.stringify(user);
    await AsyncStorage.setItem('user', json);
});

// Tell Sentry when the user changes
// $user.subscribe(async user => {
//     if(user === null) {
//         Sentry.setUser(null);
//     } else {
//         Sentry.setUser({
//             id: user.id.toString(),
//             username: user.name,
//             email: user.email
//         });
//     }
// });