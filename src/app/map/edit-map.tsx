'use client';
import React from 'react';
import {FeatureGroup, MapContainer, TileLayer} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

export const MapComponent: React.FC = () => {

    const drawControlRef = React.useRef<any>(null);
    const mapRef = React.useRef<L.Map>(null);
    let editableFG: any = null;

    const _onFeatureGroupReady = (ref: any) => {
        editableFG = ref;

        drawControlRef.current = new L.Control.Draw({
            position: 'topright',
            draw: {
                polyline: {},
                polygon: false,
                rectangle: false,
                circle: false,
                marker: false,
                circlemarker: false,
            },
            edit: {
                featureGroup: editableFG,
                remove: true,
            },
        });
    };

    return (
        <MapContainer
            ref={mapRef}
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: "100vh", width: "100%" }}
            whenReady={() => {
                if(mapRef.current)
                    mapRef.current.addControl(drawControlRef.current);
            }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FeatureGroup ref={_onFeatureGroupReady}></FeatureGroup>
        </MapContainer>
    );
};
export default MapComponent;