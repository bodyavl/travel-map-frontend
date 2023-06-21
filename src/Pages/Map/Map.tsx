import Mapbox from "../../Components/UI/Mapbox/Mapbox"
interface Props {
  apiUrl: string
}
const Map = ({apiUrl}: Props) => {
  return (
    <Mapbox apiUrl={apiUrl}/>
  )
}

export default Map