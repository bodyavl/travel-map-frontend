import React, { useState } from "react";
import { MapboxEvent, Marker, Popup } from "react-map-gl";
import UpdateForm from "../UpdateForm/UpdateForm";
import MarkerInfo from "../MarkerInfo/MarkerInfo";

interface IMapMarker {
  latitude: number;
  longitude: number;
  rating: number;
  title: string;
  description: string;
  username: string;
  date: Date;
  updateDate?: Date;
  _id: string;
}
interface IMapMarkerProps {
  marker: IMapMarker;
  isUpdating: boolean,
  updateIsUpdating: (value: boolean) => void
  fetchMarkers: () => Promise<void>
  handleClick: (
    e: MapboxEvent<MouseEvent>,
    id: string,
    longitude: number,
    latitude: number) => void,
  currentPositionId: string | null,
  updateCurrentPositionId: (value: string | null) => void;
}

const MapMarker = ({ marker, isUpdating, updateIsUpdating, fetchMarkers, handleClick, currentPositionId, updateCurrentPositionId}: IMapMarkerProps) => {
  return (
    <>
      <Marker
        longitude={marker.longitude}
        style={{ cursor: "pointer" }}
        color={
          localStorage.username && marker.username === localStorage.username
            ? "orange"
            : ""
        }
        onClick={(e) =>
          handleClick(e, marker._id, marker.longitude, marker.latitude)
        }
        latitude={marker.latitude}
      ></Marker>
      {marker._id === currentPositionId && (
        <Popup
          latitude={marker.latitude}
          onClose={() => [updateCurrentPositionId(null), updateIsUpdating(false)]}
          longitude={marker.longitude}
          anchor="top"
        >
          {isUpdating ? (
            <UpdateForm
              fetchMarkers={fetchMarkers}
              id={marker._id}
              initialTitle={marker.title}
              initialDescription={marker.description}
              initialRating={marker.rating}
            />
          ) : (
            <MarkerInfo
              id={marker._id}
              title={marker.title}
              description={marker.description}
              rating={marker.rating}
              username={marker.username}
              date={marker.updateDate ? marker.updateDate : marker.date}
              isUpdated={Boolean(marker.updateDate)}
              updateIsUpdating={updateIsUpdating}
              fetchMarkers={fetchMarkers}
            />
          )}
        </Popup>
      )}
    </>
  );
};

export default MapMarker;
