export type MapLayer = {
    name: string,
    marker_url: string,
    icon_url: string,
    markers: MapMarker[]
}

export type MapMarker = {
    name: string,
    latitude: number,
    longitude: number
}