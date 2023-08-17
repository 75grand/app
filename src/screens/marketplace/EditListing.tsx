import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@nanostores/react';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
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
import { useForm } from '../../lib/hooks/use-form';
import { formatDistance } from '../../lib/marketplace-utils';
import tw, { color } from '../../lib/tailwind';
import { EditableListingFields, Listing, NewListingFields } from '../../lib/types/marketplace';
import { $user } from '../../lib/user/user-store';
import { mergeDefaultsForInput } from '../../lib/utils';

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

    const { fields, isValid, formData } = useForm(
        isEditing
            ? mergeDefaultsForInput(EditableListingFields, listing)
            : mergeDefaultsForInput(NewListingFields, { miles_from_campus: 0 })
    );

    const listingMutation = useMutation({
        async mutationFn() {
            if(isEditing) {
                return patchListing(listing.id, formData);
            } else {
                return postListing(formData);
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

        // @ts-expect-error
        fields.image.setValue({
            uri: image.uri,
            name: image.fileName,
            type: image.type
        });
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
                        disabled={!isValid}
                        style={tw(isValid || 'opacity-50')}
                    />
                </HeaderButtons>
            )
        });
    }, [saveListing, isValid]);

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
                                    // @ts-expect-error
                                    value={fields.available.value ? 'Available': 'Unavailable'}
                                    // @ts-expect-error
                                    setValue={value => fields.available.setValue(value === 'Available')}
                                />
                            </InputLabel>
                        </Card>
                    )}

                    <Card>
                        <View style={tw('gap-4')}>
                            {!isEditing && (
                                <InputLabel required text="Image">
                                    <TouchableOpacity onPress={handleImagePress} style={tw('w-48 h-24 border border-black/10 rounded-lg justify-center items-center')}>
                                        {/* @ts-expect-error */}
                                        {fields.image.value ? (
                                            <Image
                                                // @ts-expect-error
                                                source={fields.image.value.uri}
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

                            <InputLabel required text="Title">
                                <Input {...fields.title} placeholder="Bosch Mini Fridge"/>
                            </InputLabel>

                            <InputLabel required text="Price" description="$0 – $1,000">
                                <Input
                                    {...fields.price}
                                    prefix="$ "
                                    placeholder="40"
                                    inputMode="numeric"
                                />
                            </InputLabel>

                            <InputLabel required text="Pick-Up Radius" description={formatDistance(Number(fields.miles_from_campus.value))}>
                                <Slider
                                    minimumValue={0}
                                    maximumValue={9}
                                    value={Number(fields.miles_from_campus.value)}
                                    onValueChange={value => fields.miles_from_campus.setValue(String(value))}
                                    minimumTrackTintColor={color('accent')}
                                    tapToSeek={true}
                                    step={1}
                                />
                            </InputLabel>

                            <InputLabel text="Description">
                                <Input
                                    {...fields.description}
                                    multiline={true}
                                    placeholder="Silver, works fine, small dent in the door"
                                />
                            </InputLabel>
                        </View>
                    </Card>
                </View>
            </KeyboardAwareScrollView>
        </>
    );
}