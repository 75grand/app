import { Redirect } from 'expo-router';

export default function() {
    return Redirect({ href: '/calendar' });
    // return Redirect({ href: 'home' });
}