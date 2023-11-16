'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

export default function Map() {
    return <MapContainer center={[50, 4]} zoom={12} style={{height: "90vh"}}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[50, 4]} ><Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
        </Popup></Marker>
    </MapContainer>;
}