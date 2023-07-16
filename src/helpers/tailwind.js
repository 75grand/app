import { Platform } from 'react-native';
import { create } from 'twrnc';

export const twBase = create(require('../../tailwind.config.js'));
export const color = twBase.color;

export const monospace = Platform.select({ ios: 'Menlo', android: 'monospaced' });
export const serif = Platform.select({ ios: 'Georgia', android: 'notoserif' });
export const slabSerif = Platform.select({ ios: 'Rockwell', android: serif });

const tw = twBase.style;
export default tw;