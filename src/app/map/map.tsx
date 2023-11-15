'use client';

import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

import {MapContainer, Marker, TileLayer} from "react-leaflet";

export default function Map() {
    return <MapContainer center={[50, 4]} zoom={12} style={{height: "90vh"}}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[50, 4]}/>
    </MapContainer>;
}