import * as SecureStore from 'expo-secure-store';

export async function setToken(token: string) {
    await SecureStore.setItemAsync('token', token);
}

export async function getToken() {
    const result = await SecureStore.getItemAsync('token');
    return result ?? false;
}

export async function deleteToken() {
    await SecureStore.deleteItemAsync('token');
}