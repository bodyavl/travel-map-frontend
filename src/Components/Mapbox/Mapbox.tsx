import { MapMouseEvent } from "mapbox-gl";
import Map, { MapRef, Marker, Popup, MapboxEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect, FormEvent, useRef } from "react";
import s from "./Mapbox.module.scss";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { format } from "timeago.js";
import getNewTokens from "../../services/getNewTokens";
import updateMarker from "../../services/updateMarker";
import addMarker from "../../services/addMarker";
import logout from "../../services/logout";
interface MapMarker {
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
  const [markers, setMarkers] = useState<Array<MapMarker>>();
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
    let result: Array<MapMarker> = await res.json();

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

  async function handleUpdateMarkerSubmit(
    e: FormEvent<HTMLFormElement>,
    id: string
  ) {
    e.preventDefault();
    const data = {
      title,
      description,
      rating,
    };
    let res = await updateMarker(apiUrl, data, id);
    if (res.status === 403) {
      if (await getNewTokens(apiUrl)) res = await updateMarker(apiUrl, data, id);
      else alert("Error occured");
    }
    setNewPosition(null);
    clearValues();
    await fetchMarkers();
  }
  async function handleUpdateClick(marker: MapMarker) {
    setIsUpdating(true);
    setTitle(marker.title);
    setDescription(marker.description);
    setRating(marker.rating);
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
                      <>
                        <form
                          onSubmit={(e) =>
                            handleUpdateMarkerSubmit(e, marker._id)
                          }
                        >
                          <label htmlFor="title" className={s.formLabel}>
                            Title
                          </label>
                          <input
                            type="text"
                            id="title"
                            className={s.formTextInput}
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                          <label htmlFor="descr" className={s.formLabel}>
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="descr"
                            className={s.formTextarea}
                            cols={20}
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          ></textarea>
                          <label htmlFor="rating" className={s.formLabel}>
                            Rating
                          </label>
                          <select
                            name="rating"
                            id="rating"
                            value={rating}
                            className={s.formSelect}
                            onChange={(e) =>
                              setRating(parseInt(e.target.value))
                            }
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                          </select>{" "}
                          <br />
                          <button className={s.formButton}>
                            Update marker
                          </button>
                        </form>
                      </>
                    ) : (
                      <>
                        <h1>{marker.title}</h1>
                        <p>{marker.description}</p>
                        {Array(5)
                          .fill("")
                          .map((_, i) => {
                            const ratingValue = i + 1;
                            return (
                              <AiFillStar
                                color={
                                  ratingValue <= marker.rating
                                    ? "#ffc107"
                                    : "#e4e5e9"
                                }
                                size={25}
                              />
                            );
                          })}
                        <p>
                          Created by <b>{marker.username}</b>
                          <br />
                          {marker.updateDate ? (
                            <>Updated {format(marker.updateDate)}</>
                          ) : (
                            <>{format(marker.date)}</>
                          )}
                        </p>
                        {marker.username === localStorage.username && (
                          <button
                            className={s.updateButton}
                            onClick={() => handleUpdateClick(marker)}
                          >
                            Update marker
                          </button>
                        )}
                      </>
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
                  <form onSubmit={handleAddMarkerSubmit}>
                    <label htmlFor="title" className={s.formLabel}>
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      className={s.formTextInput}
                      name="title"
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <label htmlFor="descr" className={s.formLabel}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="descr"
                      className={s.formTextarea}
                      cols={20}
                      rows={5}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                    <label htmlFor="rating" className={s.formLabel}>
                      Rating
                    </label>
                    <select
                      name="rating"
                      id="rating"
                      className={s.formSelect}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>{" "}
                    <br />
                    <button className={s.formButton}>Add marker</button>
                  </form>
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
