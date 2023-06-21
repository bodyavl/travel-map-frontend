import { MapMouseEvent } from "mapbox-gl";
import Map, { MapRef, Marker, Popup, MapboxEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect, FormEvent, useRef } from "react";
import s from "./Mapbox.module.scss";
import { Link } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import getNewTokens from "../../../services/getNewTokens";
import addMarker from "../../../services/addMarker";
import logout from "../../../services/logout";
import UpdateForm from "../UpdateForm/UpdateForm";
import MarkerInfo from "../MarkerInfo/MarkerInfo";
import AddForm from "../AddForm/AddForm";
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
interface Position {
  lng: number;
  lat: number;
}

interface Props {
  apiUrl: string;
}

const Mapbox = ({ apiUrl }: Props) => {
  const [viewState, setViewState] = useState({
    longitude: 30.523333,
    latitude: 50.45,
    zoom: 7,
  });
  const mapRef = useRef<MapRef>(null);
  const [currentPositonId, setCurrentPositionId] = useState<string | null>(
    null
  );
  const [newPosition, setNewPosition] = useState<Position | null>(null);
  const [markers, setMarkers] = useState<Array<IMapMarker>>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function fetchMarkers() {
    setIsLoading(true);
    let res = await fetch(`${apiUrl}/mark`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    let result: Array<IMapMarker> = await res.json();

    setMarkers(result);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchMarkers();
  }, []);

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

  async function handleAddMarkerSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = {
      latitude: newPosition?.lat,
      longitude: newPosition?.lng,
      title,
      description,
      rating,
      username: localStorage.username,
    };
    let res = await addMarker(apiUrl, data);
    if (res.status === 403) {
      if (await getNewTokens(apiUrl)) res = await addMarker(apiUrl, data);
      else alert("Error occured");
    }
    setNewPosition(null);
    clearValues();
    await fetchMarkers();
  }
  async function handleLogout() {
    setIsLoading(true);
    await logout(apiUrl);
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoading(false);
  }

  async function clearValues() {
    setTitle("");
    setDescription("");
    setRating(1);
  }

  return (
    <div className={s.map_container}>
      {isLoading ? (
        <div className={s.loaderContainer}>
          <RotatingLines strokeColor="black" width="50" />
        </div>
      ) : (
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
              <div key={index}>
                <Marker
                  longitude={marker.longitude}
                  style={{ cursor: "pointer" }}
                  color={
                    localStorage.username &&
                    marker.username === localStorage.username
                      ? "orange"
                      : ""
                  }
                  onClick={(e) =>
                    handleMarkerClick(
                      e,
                      marker._id,
                      marker.longitude,
                      marker.latitude
                    )
                  }
                  latitude={marker.latitude}
                ></Marker>
                {marker._id === currentPositonId && (
                  <Popup
                    latitude={marker.latitude}
                    onClose={() => [
                      setCurrentPositionId(null),
                      setIsUpdating(false),
                      clearValues(),
                    ]}
                    longitude={marker.longitude}
                    anchor="top"
                  >
                    {isUpdating ? (
                      <UpdateForm
                        onSubmit={handleAddMarkerSubmit}
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
                        updateIsUpdating={setIsUpdating}
                        fetchMarkers={fetchMarkers}
                      />
                    )}
                  </Popup>
                )}
              </div>
            ))}
            {localStorage.username && newPosition && (
              <>
                <Marker
                  longitude={newPosition.lng}
                  latitude={newPosition.lat}
                  color="orange"
                ></Marker>
                <Popup
                  longitude={newPosition.lng}
                  latitude={newPosition.lat}
                  onClose={() => setNewPosition(null)}
                  anchor="top"
                >
                  <AddForm
                    newPosition={newPosition}
                    fetchMarkers={fetchMarkers}
                    updateNewPosition={setNewPosition}/>
                </Popup>
              </>
            )}
          </Map>
          <div className={s.navbar}>
            {localStorage.username ? (
              <button className={s.loginButton} onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <>
                <Link className={s.loginButton} to={"/login"}>
                  Log in
                </Link>
                <Link className={s.signupButton} to={"/signup"}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Mapbox;
