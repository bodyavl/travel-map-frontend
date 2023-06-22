import { FormEvent, useState } from "react";
import s from "./AddForm.module.scss";
import addMarker from "../../../services/addMarker";
import getNewTokens from "../../../services/getNewTokens";
import { Socket } from "socket.io-client";

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
interface IAddFormProps {
  addMarkerToArray: (value: IMapMarker) => void;
  newPosition: Position;
  updateNewPosition: (value: Position | null) => void;
  fetchMarkers: () => Promise<void>;
}

const AddForm = ({
  addMarkerToArray,
  newPosition,
  updateNewPosition,
}: IAddFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(1);

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
    let res = await addMarker(data);
    if (res.status === 403) {
      if (await getNewTokens()) {
        res = await addMarker(data);
        let result: IMapMarker = await res.json();
        addMarkerToArray(result);
      }
      else alert("Error occured");
    }
    let result: IMapMarker = await res.json();
    addMarkerToArray(result);
    updateNewPosition(null);
    clearValues();
  }
  async function clearValues() {
    setTitle("");
    setDescription("");
    setRating(1);
  }

  return (
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
  );
};

export default AddForm;
