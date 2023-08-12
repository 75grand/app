import { isDevice } from 'expo-device';
import { Platform } from 'react-native';

export const SITE = (isDevice || Platform.OS === 'android')
    ? 'https://api.75grand.net'
    : 'http://localhost:8000';