import { Link } from "react-router-dom";
import s from "./Navbar.module.scss";
import logout from "../../../services/logout";
import { RotatingLines } from "react-loader-spinner";

interface INavbarProps {
  markersCount: number;
  updateIsLoading: (value: boolean) => void;
  fetchMarkers: () => Promise<void>;
  isLoading: boolean;
}

const Navbar = ({ markersCount, fetchMarkers, updateIsLoading, isLoading }: INavbarProps) => {
  async function handleLogout() {
    updateIsLoading(true);
    await logout();
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    await fetchMarkers();
    updateIsLoading(false);
  }
  return (
    <div className={s.navbar}>
      <div className={s.left}>Total Number of markers: {markersCount || 0}</div>
      <div className={s.right}>
        {isLoading && (
          <div className={s.loaderContainer}>
            <RotatingLines strokeColor="black" width="20" />
          </div>
        )}
        {localStorage.username ? (
          <button className={s.loginButton} onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <>
            <Link className={s.loginButton} to={"/login"}>
              Log in
            </Link>
            <Link className={s.signupButton} to={"/signup"}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
