import React from "react";
import { MapboxEvent, Marker } from "react-map-gl";

interface IMarkerProps {
  latitude: number;
  longitude: number;
  rating: number;
  title: string;
  description: string;
  username: string;
  date: Date;
  updateDate?: Date;
  _id: string;
  color: string;
  onClick: (
    e: MapboxEvent<MouseEvent>,
    id: string,
    longitude: number,
    latitude: number
  ) => void;
}

const MapMarker = (Props: IMarkerProps) => {
  return (
    <Marker
      longitude={Props.longitude}
      style={{ cursor: "pointer" }}
      color={Props.color}
      onClick={(e) =>
        Props.onClick(e, Props._id, Props.longitude, Props.latitude)
      }
      latitude={Props.latitude}
    ></Marker>
  );
};

export default MapMarker;
