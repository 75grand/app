import { create } from 'twrnc';

export const twBase = create(require('../../tailwind.config.js'));
export const color = twBase.color;
const tw = twBase.style;
export default tw;