import { MapMouseEvent } from "mapbox-gl";
import Map, { MapRef, Marker, Popup, MapboxEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect, useRef } from "react";
import s from "./Mapbox.module.scss";
import Navbar from "../Navbar/Navbar";
import MapMarker from "../MapMarker/MapMarker";
import getMarkers from "../../../services/getMarkers";
import NewMapMarker from "../NewMapMarker/NewMapMarker";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_API_URL);

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
interface Position {
  lng: number;
  lat: number;
}

const Mapbox = () => {
  const [viewState, setViewState] = useState({
    longitude: 30.523333,
    latitude: 50.45,
    zoom: 7,
  });
  const mapRef = useRef<MapRef>(null);
  const [currentPositionId, setCurrentPositionId] = useState<string | null>(
    null
  );
  const [newPosition, setNewPosition] = useState<Position | null>(null);
  const [markers, setMarkers] = useState<IMapMarker[]>();

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function fetchMarkers() {
    setIsLoading(true);
    let result: Array<IMapMarker> = await (await getMarkers()).json();
    if (result) setMarkers(result);
    setIsLoading(false);
    
    
  }
  function addMarkerToArray(value: IMapMarker) {
    setMarkers([...(markers as []), value]);
  }
  function updateMarkerInArray(value: IMapMarker) {
    setMarkers([
      ...(markers?.filter((marker) => marker._id !== value._id) as []),
      value,
    ]);
  }
  function deleteMarkerInArray(id: string) {
    setMarkers([...(markers?.filter((marker) => marker._id !== id) as [])]);
  }

  useEffect(() => {
    fetchMarkers();
  }, []);

  useEffect(() => {
    socket.on('fetch new', addMarkerToArray)
    socket.on('fetch update', updateMarkerInArray)
    socket.on('fetch delete', deleteMarkerInArray)
  }, [socket])

  function handleMarkerClick(
    e: MapboxEvent<MouseEvent>,
    id: string,
    longitude: number,
    latitude: number
  ) {
    e.originalEvent.stopPropagation();
    setCurrentPositionId(id);
    mapRef.current?.flyTo({ center: [longitude, latitude], duration: 1000 });
  }

  function handleMapDbClick(e: MapMouseEvent) {
    if (!localStorage.username) {
      alert("Log in to add new markers!");
      return;
    }
    const position = { ...e.lngLat };
    setNewPosition(position);
    mapRef.current?.flyTo({
      center: [position.lng, position.lat],
      duration: 1000,
    });
  }
  return (
    <div className={s.map_container}>
      <>
        <Map
          ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOXTOKEN}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onDblClick={handleMapDbClick}
          onClick={() => setNewPosition(null)}
          doubleClickZoom={false}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          {markers?.map((marker, index) => (
            <MapMarker
              socket={socket}
              updateMarkerInArray={updateMarkerInArray}
              deleteMarkerInArray={deleteMarkerInArray}
              key={index}
              marker={marker}
              isUpdating={isUpdating}
              updateIsUpdating={setIsUpdating}
              currentPositionId={currentPositionId}
              updateCurrentPositionId={setCurrentPositionId}
              handleClick={handleMarkerClick}
            />
          ))}
          {localStorage.username && newPosition && (
            <NewMapMarker
              socket={socket}
              addMarkerToArray={addMarkerToArray}
              newPosition={newPosition}
              updateNewPosition={setNewPosition}
            />
          )}
        </Map>
        <Navbar isLoading={isLoading} updateIsLoading={setIsLoading} />
      </>
    </div>
  );
};

export default Mapbox;
