import s from './MarkerInfo.module.scss'
import { AiFillStar } from "react-icons/ai";
import { format } from "timeago.js";
import ButtonPopup from '../ButtonPopup/ButtonPopup';

import { Socket } from 'socket.io-client';
import { deleteMarker, getNewTokens } from '../../../services';

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

interface IMarkerInfoProps {
    socket: Socket,
    deleteMarkerInArray: (id: string) => void
    id: string,
    title: string,
    description: string,
    rating: number,
    username: string,
    date: Date,
    isUpdated: boolean
    updateIsUpdating: (value: boolean) => void;
}

const MarkerInfo = ({ socket, id, title, description, rating, username, date, isUpdated, updateIsUpdating, deleteMarkerInArray}: IMarkerInfoProps) => {
  async function handleDeleteClick() {
    let res = await deleteMarker(id);
    if (res.status === 403) {
      if (await getNewTokens())
        res = await deleteMarker(id);
      else return alert("Error occured");
    }
    let result: IMapMarker = await res.json();
    deleteMarkerInArray(result._id);
    socket.emit('delete marker', result._id);
  }
  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
      {Array(5)
        .fill("")
        .map((_, i) => {
          const ratingValue = i + 1;
          return (
            <AiFillStar
              key={i}
              color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
              size={25}
            />
          );
        })}
      <p>
        Created by <b>{username}</b>
        <br />
        {isUpdated ? (
          <>Updated {format(date)}</>
        ) : (
          <>{format(date)}</>
        )}
      </p>
      {username === localStorage.username && (
        <div className={s.buttonsContainer}>
          <ButtonPopup
            handleClick={() => updateIsUpdating(true)}
          >
            Edit
          </ButtonPopup>
          <ButtonPopup
            handleClick={() => handleDeleteClick()}
          >
            Delete
          </ButtonPopup>
        </div>
      )}
    </>
  );
};

export default MarkerInfo;
