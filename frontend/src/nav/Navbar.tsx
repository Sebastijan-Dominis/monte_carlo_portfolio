import monte_carlo_logo from "../assets/monte_carlo_logo.png";
import NavBtn from "./NavBtn";

function Navbar() {
  return (
    <nav className="flex justify-between bg-[#00D1B2] px-2 py-4">
      <div>
        <img src={monte_carlo_logo} alt="" className="h-6 w-6" />
      </div>
      <div className="flex gap-4">
        <NavBtn link="/about">About</NavBtn>
        <NavBtn link="/">Sim</NavBtn>
        <NavBtn link="/saved">Saved</NavBtn>
      </div>
      <div className="flex gap-4">
        <NavBtn link="/login">Login</NavBtn>
        <NavBtn link="/signup">Signup</NavBtn>
      </div>
    </nav>
  );
}

export default Navbar;
