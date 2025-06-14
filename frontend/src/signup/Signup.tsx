import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/create-user`,
        formData
      );
      navigate("/login");
    } catch (error) {
      console.error(
        "Failed to create user: ",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="flex h-[70dvh] flex-col justify-evenly text-[#d2d2d2]">
      <form
        onSubmit={handleSignup}
        className="flex flex-col items-center justify-center"
      >
        <h1 className="text-2xl">Sign up</h1>
        <label htmlFor="email" className="mt-4 text-lg">
          Email
        </label>
        <input
          name="email"
          type="text"
          placeholder="john_doe@gmail.com"
          value={formData.email}
          onChange={(e) => handleChange(e.target.value)}
          className="mt-1 rounded-lg px-4 py-2"
        />
        <label htmlFor="password" className="mt-4 text-lg">
          Password
        </label>
        <input
          name="password"
          type="text"
          placeholder="johndoe123"
          value={formData.password}
          onChange={(e) => handleChange(e.target.value)}
          className="mt-1 rounded-lg px-4 py-2"
        />
        <button className="mt-8 h-8 w-32 rounded-lg bg-[#d2d2d2]/90 text-sm text-[#1e1e1e]">
          Signup
        </button>
      </form>
      <div className="flex flex-col">
        <p className="text-center font-semibold text-[#d2d2d2]">
          Already have an account?
        </p>
        <Link
          to={"/login"}
          className="mx-auto my-2 block text-center font-bold text-[#d2d2d2]"
        >
          Login &rarr;
        </Link>
      </div>
    </div>
  );
}

export default Signup;
