import {useMapEvents} from "react-leaflet";
import {LeafletMouseEvent} from "leaflet";

export const MapOnClick = ({onClick}:{onClick:((e:LeafletMouseEvent) => void)}) => {
    const map = useMapEvents({
        click(e) {
            onClick(e);
        },
    });
    return null;
};