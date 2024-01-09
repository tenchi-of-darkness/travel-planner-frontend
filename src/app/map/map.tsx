'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import useGeolocation from "react-hook-geolocation";

import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {useEffect, useRef} from "react";

export default function Map() {
    const location = useGeolocation()
    const mapRef = useRef<L.Map>(null)

    useEffect(()=>{
        if (!(mapRef.current == null || location.latitude === null)) {
            mapRef.current.flyTo([location.latitude, location.longitude])
        }
    }, [location.latitude])


    return <MapContainer ref={mapRef} center={[50, 4]} zoom={12} style={{height: "90vh"}}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
            location.latitude !== null?
                <Marker position={[location.latitude, location.longitude]}><Popup>
                    A pretty CSS3 popup. <br/> Easily customizable.
                </Popup></Marker>:null
        }

    </MapContainer>;
}