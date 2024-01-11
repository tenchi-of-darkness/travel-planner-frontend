'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import useGeolocation from "react-hook-geolocation";

import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {useContext, useEffect, useRef} from "react";
import {SignalRContext} from "@/app/providers";
import AuthContext from "@/providers/auth_context";
import {Button} from "@/components/ui/button";

export default function Map() {
    const location = useGeolocation()
    const mapRef = useRef<L.Map>(null)
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (!(mapRef.current == null || location.latitude === null)) {
            mapRef.current.flyTo([location.latitude, location.longitude])
        }
    }, [location.latitude, location.longitude])

    SignalRContext.useSignalREffect(
        "ReceiveLocation", // Your Event Key
        (userId, userName, latitude, longitude) => {
            console.log(`UserId: ${userId} UserName: ${userName} Latitude: ${latitude} Longitude: ${longitude}`);
        }, [auth.token]
    );


    return <>
        <Button disabled={auth.token===null || location.latitude === null} onClick={async () => {
            await SignalRContext.connection?.invoke("SendLocation", "Test", location.latitude, location.longitude);
        }}>Send Location</Button>
        <MapContainer ref={mapRef} center={[50, 4]} zoom={12} style={{height: "80vh"}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                location.latitude !== null ?
                    <Marker position={[location.latitude, location.longitude]}></Marker> : null
            }
        </MapContainer>
    </>;
}