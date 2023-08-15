import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigateWithRef(name: string, params: any) {
    if(navigationRef.isReady()) {
        // @ts-expect-error
        navigationRef.navigate(name, params);
    }
}