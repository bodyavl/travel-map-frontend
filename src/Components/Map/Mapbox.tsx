import mapboxgl, { MapMouseEvent } from 'mapbox-gl';
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect, FormEvent } from 'react';
import s from './Mapbox.module.scss'
import {AiFillStar} from 'react-icons/ai'
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
const API_URL = 'https://travel-map-api.onrender.com'

const Mapbox = () => {
  const [lng, setLng] = useState(30.523333);
  const [lat, setLat] = useState(50.45);
  const [zoom, setZoom] = useState(7);
  const [currentPositonId, setCurrentPositionId] = useState<string | null>(null);
  const [newPosition, setNewPosition] = useState<Position | null>(null);
  const [markers, setMarkers] = useState<Array<MapMarker>>()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [rating, setRating] = useState(0);

  
  async function fetchMarkers() {
    let res = await fetch(`${API_URL}/mark`,
      { headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }})
    let result:Array<MapMarker> = await res.json();
    setMarkers(result);
  }

  useEffect(() => {
    fetchMarkers();
  }, []);

  function handleMarkerClick(id: string) {
    setCurrentPositionId(id);
  }

  function handleMapDbClick(e: MapMouseEvent) {
    setNewPosition({...e.lngLat})
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
    let res = await fetch(`${API_URL}/mark/add`,
        { method: 'post',
          body: JSON.stringify(data),
          headers : { 
          'Content-Type': 'application/json'
          }
        });
    setNewPosition(null);
    await fetchMarkers();
    
  }
  
  return (
    <div className={s.map_container}>
      <Map mapboxAccessToken={import.meta.env.VITE_MAPBOXTOKEN}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: zoom
        }}
        onDblClick={handleMapDbClick}
        doubleClickZoom={false}
        mapStyle="mapbox://styles/mapbox/streets-v12">
        {markers?.map((marker, index) => 
          (<div key={index}>
            <Marker longitude={marker.longitude} onClick={() => handleMarkerClick(marker._id)} latitude={marker.latitude}></Marker>
                  {marker._id === currentPositonId && (<Popup latitude={marker.latitude} onClose={() => setCurrentPositionId(null)} offset={[7, 0]} closeOnClick={false} longitude={marker.longitude} anchor='left'>
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
            <Popup longitude={newPosition.lng} latitude={newPosition.lat} onClose={() => setNewPosition(null)} offset={[7, 0]} closeOnClick={false} anchor='left'>
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Title</label>
              <input type="text" id='title' name='title' onChange={e => setTitle(e.target.value)}/>
              <label htmlFor="descr">Description</label>
              <textarea name="description" id="descr" cols={20} rows={5} onChange={e => setDescription(e.target.value)}></textarea><br />
              <label htmlFor="rating" >Rating</label>
              <select name="rating" id="rating" onChange={e => setRating(parseInt(e.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select> <br />
              <button>Add marker</button>
            </form>
            
            </Popup>
      </>)}
      </Map>
    </div>
  )
}

export default Mapbox