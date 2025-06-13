import monte_carlo_logo from "../assets/monte_carlo_logo.png";
import NavBtn from "./NavBtn";

function hello() {
  console.log("hello");
}

function Navbar() {
  return (
    <nav className="flex justify-between bg-[#00D1B2] px-2 py-4">
      <div>
        <img src={monte_carlo_logo} alt="" className="h-6 w-6" />
      </div>
      <div className="flex gap-4">
        <NavBtn onClick={hello}>About</NavBtn>
        <NavBtn onClick={hello}>Sim</NavBtn>
        <NavBtn onClick={hello}>Saved</NavBtn>
      </div>
      <div className="flex gap-4">
        <NavBtn onClick={hello}>Login</NavBtn>
        <NavBtn onClick={hello}>Signup</NavBtn>
      </div>
    </nav>
  );
}

export default Navbar;
