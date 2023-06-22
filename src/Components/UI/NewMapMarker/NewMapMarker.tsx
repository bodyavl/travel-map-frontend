import React from "react";
import { Marker, Popup } from "react-map-gl";
import AddForm from "../AddForm/AddForm";
import { Socket } from "socket.io-client";

interface Position {
  lng: number;
  lat: number;
}
interface IMapMarker {
  latitude: number;
  longitude: number;
  rating: number;
  title: string;
  description: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
interface INewMapMarkerProps {
  addMarkerToArray: (value: IMapMarker) => void
  newPosition: Position;
  updateNewPosition: (value: Position | null) => void;
  fetchMarkers: () => Promise<void>;
}

const NewMapMarker = ({
  addMarkerToArray,
  newPosition,
  updateNewPosition,
  fetchMarkers,
}: INewMapMarkerProps) => {
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
          addMarkerToArray={addMarkerToArray}
          newPosition={newPosition}
          fetchMarkers={fetchMarkers}
          updateNewPosition={updateNewPosition}
        />
      </Popup>
    </>
  );
};

export default NewMapMarker;
