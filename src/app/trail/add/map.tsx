import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import useGeolocation from "react-hook-geolocation";

import {MapContainer, MapContainerProps, Marker, Popup, TileLayer, useMapEvents} from "react-leaflet";
import React, {useContext, useEffect, useRef} from "react";
import {SignalRContext} from "@/app/providers";
import AuthContext from "@/providers/auth_context";
import {Button} from "@/components/ui/button";
import {MapOnClick} from "@/app/trail/add/map-on-click";
import {NotInForm} from "@/app/trail/add/page";

export default function Map({notInForm, setNotInForm}: {notInForm: NotInForm, setNotInForm:  React.Dispatch<React.SetStateAction<NotInForm>>}) {
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

    let markers = [];

    if(notInForm.end != null && notInForm.end.coordinates[1] != null){
        markers.push(<Marker position={[notInForm.end!.coordinates[0], notInForm.end!.coordinates[1]]}></Marker>);
    }

    if(notInForm.start != null && notInForm.start.coordinates[1] != null){
        markers.push(<Marker position={[notInForm.start!.coordinates[0], notInForm.start!.coordinates[1]]}></Marker>);
    }

    return <>
        <MapContainer ref={mapRef} center={[50, 4]} zoom={12} style={{ minHeight: "90vh", minWidth: "70vw" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapOnClick onClick={(e) => {
                setNotInForm(x => {
                    return {start: x.start, end: {type: "Point", coordinates: [e.latlng.lat, e.latlng.lng]}}
                })
            }}/>
            {markers}
        </MapContainer>
    </>;
}