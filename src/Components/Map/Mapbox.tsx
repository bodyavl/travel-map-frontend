import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useState, useEffect } from 'react';
import s from './Mapbox.module.scss'

const Mapbox = () => {
    const mapContainer = useRef<any>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(30.523333);
    const [lat, setLat] = useState(50.45);
    const [zoom, setZoom] = useState(7);
    useEffect(() => {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOXTOKEN
        if (map.current) return;
            map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
           });
        });
  return (
    <div>
        <div ref={mapContainer} className={s.map_container} />
    </div>
  )
}

export default Mapbox