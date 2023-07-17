import { FormEvent, useState } from "react";
import s from "./UpdateForm.module.scss";
import { Socket } from "socket.io-client";
import { getNewTokens, updateMarker } from "../../../services";

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
interface IUpdateFormProps {
  socket: Socket,
  updateMarkerInArray: (value: IMapMarker) => void,
  updateIsUpdating: (value: boolean) => void,
  id: string;
  initialTitle: string;
  initialDescription: string;
  initialRating: number;
}

const UpdateForm = ({ socket, updateIsUpdating, updateMarkerInArray, id, initialTitle, initialDescription, initialRating }: IUpdateFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [rating, setRating] = useState(initialRating);

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
    let res = await updateMarker(data, id);
    if (res.status === 403) {
      if (await getNewTokens()) res = await updateMarker(data, id);
      else return alert("Error occured");
    }
    let result: IMapMarker = await res.json();
    updateMarkerInArray(result);
    socket.emit('update marker', result._id);
    updateIsUpdating(false);
  }
  return (
    <form onSubmit={(e) => handleUpdateMarkerSubmit(e, id)}>
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
        onChange={(e) => setRating(parseInt(e.target.value))}
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>{" "}
      <br />
      <button className={s.formButton}>Update marker</button>
    </form>
  );
};

export default UpdateForm;
