import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {Point} from "geojson";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const toRadians = (degrees: number, precision = 8) => {
  return parseFloat(((degrees * Math.PI) / 180).toFixed(precision));
};

export function distanceLatLng(position1: Point,position2: Point){
  var lat1=position1.coordinates[0];
  var lat2=position2.coordinates[0];
  var lon1=position1.coordinates[1];
  var lon2=position2.coordinates[1];
  var R = 6371000; // metres
  var phi1 = toRadians(lat1);
  var phi2 = toRadians(lat2);
  var deltaPhi = toRadians((lat2-lat1));
  var deltaLambda = toRadians((lon2-lon1));

  var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}
