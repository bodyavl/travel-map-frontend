import mapboxgl, { MapMouseEvent } from 'mapbox-gl'
import Map, { MapRef, Marker, Popup, MapboxEvent } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect, FormEvent, useRef } from 'react';
import s from './Mapbox.module.scss'
import {AiFillStar} from 'react-icons/ai'
import { Link } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';
interface MapMarker {
  latitude: number,
  longitude: number,
  rating: number,
  title: string,
  description: string,
  _id: string
}
interface Position {
  lng: number,
  lat: number
}

interface Props {
  apiUrl: string
}

const Mapbox = ({apiUrl}: Props) => {
  const [viewState, setViewState] = useState({
    longitude: 30.523333,
    latitude: 50.45,
    zoom: 7
  });
  const mapRef = useRef<MapRef>(null);
  const [currentPositonId, setCurrentPositionId] = useState<string | null>(null);
  const [newPosition, setNewPosition] = useState<Position | null>(null);
  const [markers, setMarkers] = useState<Array<MapMarker>>()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [rating, setRating] = useState(1);

  const [isLoading, setIsLoading] = useState(false);


  
  async function fetchMarkers() {
    setIsLoading(true);
    let res = await fetch(`${apiUrl}/mark`,
      { headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }})
    let result:Array<MapMarker> = await res.json();
    setMarkers(result);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchMarkers();
  }, []);

  function handleMarkerClick(e: MapboxEvent<MouseEvent>, id: string, longitude: number, latitude: number) {
    e.originalEvent.stopPropagation();
    setCurrentPositionId(id);
    mapRef.current?.flyTo({center: [longitude, latitude], duration: 1000});
  }

  function handleMapDbClick(e: MapMouseEvent) {
    const position = {...e.lngLat};
    setNewPosition(position)
    mapRef.current?.flyTo({center: [position.lng, position.lat], duration: 1000});
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = {
      latitude: newPosition?.lat,
      longitude: newPosition?.lng,
      title,
      description,
      rating
    }
    let res = await fetch(`${apiUrl}/mark/add`,
        { method: 'post',
          body: JSON.stringify(data),
          headers : { 
          'Content-Type': 'application/json'
          }
        });
    setNewPosition(null);
    setTitle("");
    setDescription("");
    setRating(1);
    await fetchMarkers();
    
  }
  
  async function handleLogout() {
    setIsLoading(true)
    let res = await fetch(`${apiUrl}/user/logout`,
        { method: 'delete',
          body: JSON.stringify({refreshToken: localStorage.refreshToken}),
          headers : { 
          'Content-Type': 'application/json'
          }
        });
    
    localStorage.removeItem('username')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsLoading(false);
  }

  return (
    <div className={s.map_container}>
      
      {isLoading ? 
        <div className={s.loaderContainer}>
          <RotatingLines strokeColor='black'/>
        </div>
      : (<>
        <Map ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOXTOKEN}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onDblClick={handleMapDbClick}
          onClick={() => setNewPosition(null) }
          doubleClickZoom={false}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          
          >
          {markers?.map((marker, index) => 
            (<div key={index}>
              <Marker longitude={marker.longitude} style={{cursor: 'pointer'}} onClick={(e) => handleMarkerClick(e, marker._id, marker.longitude, marker.latitude)} latitude={marker.latitude} ></Marker>
                    {marker._id === currentPositonId && (<Popup latitude={marker.latitude} onClose={() => setCurrentPositionId(null)} longitude={marker.longitude} anchor='top'>
                      <h1>{marker.title}</h1>
                      <p>{marker.description}</p>
                      {Array(5).fill('').map((_, i) => {
                        const ratingValue = i + 1
                        return (<AiFillStar color={ratingValue <= marker.rating ? "#ffc107" : "#e4e5e9"} size={25}/>)
                        })}

                    </Popup>)}
              </div>)
          )}
        {newPosition && 
          (<><Marker longitude={newPosition.lng} latitude={newPosition.lat}></Marker>
              <Popup longitude={newPosition.lng} latitude={newPosition.lat} onClose={() => setNewPosition(null)} anchor='top'>
                <form onSubmit={handleSubmit}>
                  <label htmlFor="title" className={s.formLabel}>Title</label>
                  <input type="text" id='title' className={s.formTextInput} name='title'onChange={e => setTitle(e.target.value)} required/>
                  <label htmlFor="descr" className={s.formLabel}>Description</label>
                  <textarea name="description" id="descr" className={s.formTextarea} cols={20} rows={5} onChange={e => setDescription(e.target.value)} required></textarea>
                  <label htmlFor="rating" className={s.formLabel}>Rating</label>
                  <select name="rating" id="rating" className={s.formSelect} onChange={e => setRating(parseInt(e.target.value))}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select> <br />
                  <button className={s.formButton}>Add marker</button>
                </form>
              </Popup>
        </>)}
        </Map>
        <div className={s.navbar}>
          {localStorage.username ? 
            (<button className={s.loginButton} onClick={handleLogout}>Log out</button>) :
            (<>
              <Link className={s.loginButton} to={'/login'}>Log in</Link>
              <Link className={s.signupButton} to={'/signup'}>Sign up</Link>
            </>)}
        </div>
      </>)}
    </div>
  )
}

export default Mapbox