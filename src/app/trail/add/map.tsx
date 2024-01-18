import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import useGeolocation from "react-hook-geolocation";

import {MapContainer, MapContainerProps, Marker, Polyline, Popup, TileLayer, useMapEvents} from "react-leaflet";
import React, {useContext, useEffect, useRef} from "react";
import {SignalRContext} from "@/app/providers";
import AuthContext from "@/providers/auth_context";
import {Button} from "@/components/ui/button";
import {MapOnClick} from "@/app/trail/add/map-on-click";
import {NotInForm} from "@/app/trail/add/page";
import {LineString, Point} from "geojson";
import {distanceLatLng} from "@/lib/utils";
import {Simulate} from "react-dom/test-utils";
import click = Simulate.click;

export default function Map({notInForm, setNotInForm, isEdit, lineString = null}: {
    notInForm: NotInForm,
    setNotInForm: React.Dispatch<React.SetStateAction<NotInForm>>,
    isEdit: boolean,
    lineString: LineString | null,
}) {
    const location = useGeolocation()
    const mapRef = useRef<L.Map>(null)
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (lineString!==null) return;

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
    let lineStrings = [];

    if (notInForm.end != null && notInForm.end.coordinates[1] != null) {
        console.log(notInForm);
        markers.push(<Marker position={[notInForm.end!.coordinates[0], notInForm.end!.coordinates[1]]}></Marker>);
    }

    if (notInForm.start != null && notInForm.start.coordinates[1] != null) {
        console.log(notInForm);
        markers.push(<Marker position={[notInForm.start!.coordinates[0], notInForm.start!.coordinates[1]]}></Marker>);
    }

    if (notInForm.start != null && notInForm.start.coordinates[1] != null && notInForm.end != null && notInForm.end.coordinates[1] != null) {
        lineStrings.push(<Polyline
            positions={[[notInForm.start!.coordinates[0], notInForm.start!.coordinates[1]], [notInForm.end!.coordinates[0], notInForm.end!.coordinates[1]]]}/>);
    }

    if (lineString !== null) {
        lineStrings.push(<Polyline positions={lineString.coordinates.map(x => [x[0], x[1]])}/>);
    }

    const center = lineString?.coordinates[Math.floor(lineString.coordinates.length/2)];

    return <>
        <MapContainer ref={mapRef} center={center!==undefined?[center[0], center[1]]:[50, 4]} zoom={12} style={{minHeight: "90vh", minWidth: "70vw", zIndex: 1}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapOnClick onClick={(e) => {
                if (isEdit) {
                    setNotInForm(x => {
                        const clickedCoordinate = [e.latlng.lat, e.latlng.lng];
                        const clickedPoint: Point = {type: "Point", coordinates: clickedCoordinate};
                        if (x.start === null) {
                            return {start: {type: "Point", coordinates: clickedCoordinate}, end: x.end}
                        }
                        if (x.end === null) {
                            return {start: x.start, end: {type: "Point", coordinates: clickedCoordinate}}
                        }
                        if (distanceLatLng(x.start, clickedPoint) > distanceLatLng(x.end, clickedPoint)) {
                            return {start: x.start, end: {type: "Point", coordinates: clickedCoordinate}}
                        } else {
                            return {start: {type: "Point", coordinates: clickedCoordinate}, end: x.end}
                        }
                    })
                } else {
                    setNotInForm(x => {
                        return {start: x.start, end: {type: "Point", coordinates: [e.latlng.lat, e.latlng.lng]}}
                    })
                }
            }}/>
            {lineStrings}
            {markers}
            {isEdit && location.latitude && location.longitude ?
                <Marker position={[location.latitude, location.longitude]}/> : null}
        </MapContainer>
    </>;
}