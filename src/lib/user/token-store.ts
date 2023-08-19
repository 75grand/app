import { atom } from 'nanostores';
import * as SecureStore from 'expo-secure-store';

export const $token = atom<string>(null);

// Load saved token
export async function loadTokenFromDisk() {
    const token = await SecureStore.getItemAsync('token');
    $token.set(token);
}

// Save the token when it changes
$token.listen(async token => {
    if(token === null) {
        await SecureStore.deleteItemAsync('token');
    } else {
        await SecureStore.setItemAsync('token', token);
    }
});