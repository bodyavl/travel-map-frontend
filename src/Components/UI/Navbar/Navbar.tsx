import { Link } from "react-router-dom";
import s from "./Navbar.module.scss";
import logout from "../../../services/logout";
import { Value } from "sass";

interface INavbarProps {
    updateIsLoading: (value: boolean) => void
}

const Navbar = ({updateIsLoading}: INavbarProps) => {

  async function handleLogout() {
    updateIsLoading(true);
    await logout();
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    updateIsLoading(false);
  }
  return (
    <div className={s.navbar}>
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
