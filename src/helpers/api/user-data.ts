import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../models/user';

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

export async function setUserData(user: User) {
    const userString = JSON.stringify(user);
    await AsyncStorage.setItem('user', userString);
}

export async function getUserData(): Promise<User|null> {
    const userString = await AsyncStorage.getItem('user');
    if(userString === null) return null;
    return JSON.parse(userString) as User;
}