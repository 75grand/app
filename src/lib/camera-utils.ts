import { isDevice } from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import { ActionResize, manipulateAsync } from 'expo-image-manipulator';

/**
 * Display a camera for the user to take a picture
 * @see https://docs.expo.dev/versions/latest/sdk/imagepicker/
 * @returns The resulting image, or null if canceled or permission denied
 */
export async function takePhoto(options: ImagePicker.ImagePickerOptions = {}) {
    // The camera doesn't work in the simulator
    if(!isDevice) return await pickPhoto(options);

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if(!permission.granted) return null;

    const result = await ImagePicker.launchCameraAsync({
        preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
        quality: 0,
        ...options
    });

    return result.assets ? result.assets[0] : null;
}

/**
 * Display an image picker
 * @see https://docs.expo.dev/versions/latest/sdk/imagepicker/
 * @returns The resulting image, or null if canceled or permission denied
 */
export async function pickPhoto(options: ImagePicker.ImagePickerOptions = {}) {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!permission.granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
        preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
        quality: 0,
        ...options
    });

    return result.assets ? result.assets[0] : null;
}

export async function resizeImage(image: ImagePicker.ImagePickerAsset, longestSide = 1000) {
    const dimensions: ActionResize['resize'] = {
        [image.width > image.height ? 'width' : 'height']: longestSide
    }

    return await manipulateAsync(
        image.uri,
        [{ resize: dimensions }],
        { compress: 0.5 }
    );
}