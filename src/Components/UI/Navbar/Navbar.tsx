import { Link } from "react-router-dom";
import s from "./Navbar.module.scss";
import logout from "../../../services/logout";
import { RotatingLines } from "react-loader-spinner";

interface INavbarProps {
    updateIsLoading: (value: boolean) => void
    fetchMarkers: () => Promise<void>
    isLoading: boolean
}

const Navbar = ({ fetchMarkers, updateIsLoading, isLoading}: INavbarProps) => {

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
  );
};

export default Navbar;
