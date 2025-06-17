import { useNavigate } from "react-router-dom";

import monte_carlo_logo from "../assets/monte_carlo_logo.png";
import NavBtn from "./NavBtn";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { isLoggedIn, isLoggingIn, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="flex w-full justify-between bg-[#00D1B2] px-2 py-4">
      <div>
        <img
          src={monte_carlo_logo}
          alt=""
          className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12"
        />
      </div>
      <div className="flex gap-4">
        <NavBtn link="/about">About</NavBtn>
        <NavBtn link="/">Sim</NavBtn>
        <NavBtn link="/settings">Settings</NavBtn>
      </div>
      <div className="flex gap-4">
        {!isLoggedIn && !isLoggingIn && <NavBtn link="/login">Login</NavBtn>}
        {!isLoggedIn && !isLoggingIn && <NavBtn link="/signup">Signup</NavBtn>}
        {isLoggedIn && (
          <button
            className="h-6 w-12 content-center rounded-md bg-[#1e1e1e]/90 text-center text-xs text-[#d2d2d2] md:h-8 md:w-16 md:text-sm lg:h-10 lg:w-20 lg:text-base xl:h-12 xl:w-24 xl:text-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
