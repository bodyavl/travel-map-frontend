import Mapbox from "../../Components/Mapbox/Mapbox"
interface Props {
  apiUrl: string
}
const Map = ({apiUrl}: Props) => {
  return (
    <Mapbox apiUrl={apiUrl}/>
  )
}

export default Map