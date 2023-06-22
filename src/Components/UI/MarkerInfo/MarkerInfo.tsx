import s from './MarkerInfo.module.scss'
import { AiFillStar } from "react-icons/ai";
import { format } from "timeago.js";
import ButtonPopup from '../ButtonPopup/ButtonPopup';
import deleteMarker from '../../../services/deleteMarker';
import getNewTokens from '../../../services/getNewTokens';

interface IMarkerInfoProps {
    id: string,
    title: string,
    description: string,
    rating: number,
    username: string,
    date: Date,
    isUpdated: boolean
    fetchMarkers: () => Promise<void>;
    updateIsUpdating: (value: boolean) => void;
}

const MarkerInfo = ({id, title, description, rating, username, date, isUpdated, fetchMarkers, updateIsUpdating}: IMarkerInfoProps) => {
  async function handleDeleteClick() {
    let res = await deleteMarker(id);
    if (res.status === 403) {
      if (await getNewTokens())
        res = await deleteMarker(id);
      else alert("Error occured");
    }
    await fetchMarkers();
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
