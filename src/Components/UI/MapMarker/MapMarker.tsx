import React, { useState } from "react";
import { MapboxEvent, Marker, Popup } from "react-map-gl";
import UpdateForm from "../UpdateForm/UpdateForm";
import MarkerInfo from "../MarkerInfo/MarkerInfo";
import { Socket } from "socket.io-client";

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
interface IMapMarkerProps {
  socket: Socket,
  marker: IMapMarker;
  isUpdating: boolean;
  updateMarkerInArray: (value: IMapMarker) => void;
  deleteMarkerInArray: (id: string) => void;
  updateIsUpdating: (value: boolean) => void;
  handleClick: (
    e: MapboxEvent<MouseEvent>,
    id: string,
    longitude: number,
    latitude: number
  ) => void;
  currentPositionId: string | null;
  updateCurrentPositionId: (value: string | null) => void;
}

const MapMarker = ({
  socket,
  marker,
  updateMarkerInArray,
  deleteMarkerInArray,
  isUpdating,
  updateIsUpdating,
  handleClick,
  currentPositionId,
  updateCurrentPositionId,
}: IMapMarkerProps) => {
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
          onClose={() => [
            updateCurrentPositionId(null),
            updateIsUpdating(false),
          ]}
          longitude={marker.longitude}
          anchor="top"
        >
          {isUpdating ? (
            <UpdateForm
              socket={socket}
              updateIsUpdating={updateIsUpdating}
              updateMarkerInArray={updateMarkerInArray}
              id={marker._id}
              initialTitle={marker.title}
              initialDescription={marker.description}
              initialRating={marker.rating}
            />
          ) : (
            <MarkerInfo
              socket={socket}
              deleteMarkerInArray={deleteMarkerInArray}
              id={marker._id}
              title={marker.title}
              description={marker.description}
              rating={marker.rating}
              username={marker.username}
              date={
                marker.updatedAt === marker.createdAt
                  ? marker.createdAt
                  : marker.updatedAt
              }
              isUpdated={Boolean(marker.updatedAt !== marker.createdAt)}
              updateIsUpdating={updateIsUpdating}
            />
          )}
        </Popup>
      )}
    </>
  );
};

export default MapMarker;
