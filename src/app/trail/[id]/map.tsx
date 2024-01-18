'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import useGeolocation from "react-hook-geolocation";

import {MapContainer, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import {useContext, useEffect, useRef} from "react";
import {SignalRContext} from "@/app/providers";
import AuthContext from "@/providers/auth_context";
import {Button} from "@/components/ui/button";
import {LineString} from "geojson";

export default function Map({lineString}: {lineString:LineString}) {
    const location = useGeolocation()
    const mapRef = useRef<L.Map>(null)

    const center = lineString.coordinates[Math.floor(lineString.coordinates.length/2)];

    return <>
        <MapContainer ref={mapRef} center={[center[0],center[1]]} zoom={12} style={{height: "80vh", zIndex: 1}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                location.latitude !== null ?
                    <Marker position={[location.latitude, location.longitude]}></Marker> : null
            }
            <Polyline positions={lineString.coordinates.map(x=>[x[0],x[1]])} />
        </MapContainer>
    </>;
}