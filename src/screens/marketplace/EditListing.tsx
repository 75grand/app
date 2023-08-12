import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@nanostores/react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useLayoutEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Masks } from 'react-native-mask-input';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Card from '../../components/Card';
import Input from '../../components/Input';
import InputLabel from '../../components/InputLabel';
import PillRadioInput from '../../components/PillRadioInput';
import { patchListing, patchUser, postListing } from '../../lib/api/api';
import { takePhoto } from '../../lib/camera-utils';
import tw from '../../lib/tailwind';
import { Listing } from '../../lib/types/marketplace';
import { $user } from '../../lib/user/user-store';

export const screenOptions: NativeStackNavigationOptions = {
    title: 'Edit Listing',
    presentation: 'modal',
    gestureEnabled: false
}

export default function EditListing() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    const params = useRoute().params as any;
    const listing = params?.listing as Listing ?? null;

    const user = useStore($user);
    const [phone, setPhone] = useState(user.phone);

    const userMutation = useMutation({
        mutationFn: () => patchUser({ phone }),
        onSuccess: newUser => $user.set(newUser)
    });

    const isEditing = listing !== null;

    const [image, setImage] = useState<ImagePickerAsset>();
    const [title, setTitle] = useState(listing?.title ?? '');
    const [available, setAvailable] = useState(listing?.available ?? true);
    const [description, setDescription] = useState(listing?.description ?? '');
    const [price, setPrice] = useState(`${listing?.price ?? ''}`);
    const [distance, setDistance] = useState(`${listing?.miles_from_campus ?? ''}`);

    const listingMutation = useMutation({
        async mutationFn() {
            if(isEditing) {
                return patchListing(listing.id, {
                    title,
                    available,
                    price: Number(price),
                    description,
                    miles_from_campus: Number(distance)
                });
            } else {
                return postListing({
                    title,
                    description,
                    price: Number(price),
                    miles_from_campus: Number(distance),
                    image: {
                        uri: image.uri,
                        name: image.fileName,
                        type: image.type
                    }
                });
            }
        },
        onSuccess() {
            queryClient.invalidateQueries(['listings']);
        }
    });

    async function saveListing() {
        if(!$user.get().phone) {
            await userMutation.mutateAsync();
        }

        await listingMutation.mutateAsync();

        navigation.goBack();
    }

    async function handleImagePress() {
        const image = await takePhoto();
        if(image === null) return;
        setImage(image);
    }
    
    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Listing' : 'Create Listing',
            headerLeft: () => (
                <HeaderButtons left>
                    <Item
                        title="Cancel"
                        onPress={navigation.goBack}
                    />
                </HeaderButtons>
            ),
            headerRight: () => (
                <HeaderButtons>
                    <Item
                        title={isEditing ? 'Save' : 'Post'}
                        buttonStyle={tw('font-semibold')}
                        onPress={saveListing}
                    />
                </HeaderButtons>
            )
        });
    }, [saveListing]);

    return (
        <>
            <StatusBar animated style="light"/>

            <KeyboardAwareScrollView>
                <View style={tw('p-3 gap-3')}>
                    {!$user.get().phone && (
                        <Card>
                            <InputLabel text="Phone Number">
                                <Input
                                    mask={Masks.USA_PHONE}
                                    value={phone}
                                    setValue={setPhone}
                                    placeholder="(651) 696-6000"
                                    maxLength={14}
                                    inputMode="numeric"
                                />
                            </InputLabel>
                        </Card>
                    )}

                    {isEditing && (
                        <Card>
                            <InputLabel text="Is it still available?">
                                <PillRadioInput
                                    options={['Available', 'Unavailable']}
                                    value={available ? 'Available': 'Unavailable'}
                                    setValue={value => setAvailable(value === 'Available')}
                                />
                            </InputLabel>
                        </Card>
                    )}

                    <Card>
                        <View style={tw('gap-4')}>
                            {!isEditing && (
                                <InputLabel text="Image">
                                    <TouchableOpacity onPress={handleImagePress} style={tw('w-48 h-24 border border-black/10 rounded-lg justify-center items-center')}>
                                        {image ? (
                                            <Image
                                                source={image}
                                                style={tw('w-48 h-24 border border-black/10 rounded-lg')}
                                            />
                                        ) : (
                                            <>
                                                <Ionicons name="camera" style={tw('text-3xl text-accent')}/>
                                                <Text style={tw('font-semibold')}>Take Photo</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </InputLabel>
                            )}

                            <InputLabel text="Title">
                                <Input
                                    value={title}
                                    setValue={setTitle}
                                    placeholder="Mini Fridge"
                                />
                            </InputLabel>

                            <InputLabel text="Price" description="$0 – $1,000">
                                <Input
                                    value={price}
                                    setValue={setPrice}
                                    prefix="$ "
                                    placeholder="40"
                                    maxLength={4}
                                    inputMode="numeric"
                                    error={Number(price) <= 1000 ? '' : 'Price must be less than $1,000'}
                                />
                            </InputLabel>

                            <InputLabel text="Description">
                                <Input
                                    value={description}
                                    setValue={setDescription}
                                    multiline={true}
                                    placeholder="Silver, works fine, small dent in the door"
                                />
                            </InputLabel>

                            <InputLabel text="Location">
                                <PillRadioInput
                                    scroll
                                    value={distance}
                                    setValue={setDistance}
                                    options={{
                                        0: 'On Campus',
                                        1: '1 mile',
                                        2: '2 miles',
                                        5: '5 miles',
                                        9: 'More than 5 miles'
                                    }}
                                />
                            </InputLabel>
                        </View>
                    </Card>
                </View>
            </KeyboardAwareScrollView>
        </>
    );
}