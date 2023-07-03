import { Marker, Popup } from "react-map-gl";
import AddForm from "../AddForm/AddForm";
import { Socket } from "socket.io-client";

interface Position {
  lng: number;
  lat: number;
}
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
interface INewMapMarkerProps {
  socket: Socket,
  addMarkerToArray: (value: IMapMarker) => void
  newPosition: Position;
  updateNewPosition: (value: Position | null) => void;
}

const NewMapMarker = ({
  socket,
  addMarkerToArray,
  newPosition,
  updateNewPosition,
}: INewMapMarkerProps) => {
  return (
    <>
      <Marker
        longitude={newPosition.lng}
        latitude={newPosition.lat}
        color="orange"
      ></Marker>
      <Popup
        longitude={newPosition.lng}
        latitude={newPosition.lat}
        onClose={() => updateNewPosition(null)}
        anchor="top"
      >
        <AddForm
          socket={socket}
          addMarkerToArray={addMarkerToArray}
          newPosition={newPosition}
          updateNewPosition={updateNewPosition}
        />
      </Popup>
    </>
  );
};

export default NewMapMarker;
