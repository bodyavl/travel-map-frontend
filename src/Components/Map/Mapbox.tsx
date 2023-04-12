import mapboxgl from 'mapbox-gl';
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect } from 'react';
import s from './Mapbox.module.scss'

interface MapMarker {
  latitude: number,
  longitude: number,
  rating: number,
  title: string,
  description: string,
  _id: string
}
const API_URL = 'https://travel-map-api.onrender.com'

const Mapbox = () => {
  const [lng, setLng] = useState(30.523333);
  const [lat, setLat] = useState(50.45);
  const [zoom, setZoom] = useState(7);
  const [markers, setMarkers] = useState<Array<MapMarker>>()
  useEffect(() => {
    async function fetchMarkers() {
      let res = await fetch(`${API_URL}/mark`,
        { headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }})
      let result:Array<MapMarker> = await res.json();
      setMarkers(result);
    }
    fetchMarkers();
  }, []);



    
  
  return (
    <div className={s.map_container}>
      <Map mapboxAccessToken={import.meta.env.VITE_MAPBOXTOKEN}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: zoom
        }}
        
        mapStyle="mapbox://styles/mapbox/streets-v12">
        {markers?.map((marker, index) => {
          console.log(marker.title)
          return (<div key={index}><Marker longitude={marker.longitude} latitude={marker.latitude}/>
                  <Popup latitude={marker.latitude} longitude={marker.longitude} anchor='left'>You are here</Popup></div>)
        })}
      </Map>
    </div>
  )
}

export default Mapbox