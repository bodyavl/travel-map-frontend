import React from "react";
import { Marker, Popup } from "react-map-gl";
import AddForm from "../AddForm/AddForm";

interface Position {
    lng: number,
    lat: number
}
interface INewMapMarkerProps {
    newPosition: Position
    updateNewPosition: (value: Position | null) => void
    fetchMarkers: () => Promise<void>
}

const NewMapMarker = ({newPosition, updateNewPosition, fetchMarkers}: INewMapMarkerProps) => {
  return (
    <>
      <Marker
        longitude={newPosition.lng}
        latitude={newPosition.lat}
        color="orange"
      ></Marker>
      <Popup
        longitude={newPosition.lng}
        latitude={newPosition.lat}
        onClose={() => updateNewPosition(null)}
        anchor="top"
      >
        <AddForm
          newPosition={newPosition}
          fetchMarkers={fetchMarkers}
          updateNewPosition={updateNewPosition}
        />
      </Popup>
    </>
  );
};

export default NewMapMarker;