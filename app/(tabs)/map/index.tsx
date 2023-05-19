import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import { get } from '../../../lib/http';
import { MapLayer } from '../../../lib/models/map';
import tw, { color } from '../../../lib/tailwind';

export default function() {
    const initialRegion: Region = {
        latitude: 44.938179,
        longitude: -93.168175,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    }

    const [location, setLocation] = useState(null as Location.LocationObject);
    const [layers, setLayers] = useState([] as MapLayer[]);

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        get<MapLayer[]>('map')
            .then(setLayers)
            .catch(() => alert('Error loading map data'));

        Location.requestForegroundPermissionsAsync()
            .then(permission => {
                if(permission.granted) {
                    Location.getCurrentPositionAsync()
                        .then(setLocation);
                }
            });
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if(location === null) return;

            mapRef.current?.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            }, 2000);
        }, 1000);
    }, [location]);

    return (
        <>
            <Stack.Screen options={{
                title: 'Magic Map',
                header: () => <></>
            }}/>

            <MapView
                ref={mapRef}
                style={tw('w-full h-full')}
                initialRegion={initialRegion}
                showsUserLocation={true}
                followsUserLocation={true}
                showsPointsOfInterest={false}
                pitchEnabled={false}
                tintColor={color('accent')}
            >
                {layers.map(layer => {
                    return layer.markers.map(marker => {
                        return (
                            <Marker
                                key={marker.latitude + marker.longitude + marker.name}
                                coordinate={marker}
                                image={{ uri: layer.icon_url, cache: 'force-cache' }} 
                                title={marker.name}
                                flat={true}
                            />
                        );
                    });
                })}
            </MapView>
        </>
    );
}