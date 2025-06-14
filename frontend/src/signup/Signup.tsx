import axios from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Spinner from "../spinner/Spinner";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateInputs = (email: string, password: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (!password || password.length < 8 || password.length > 20) {
      alert("Password has to be between 8 and 20 characters.");
      return false;
    }
    return true;
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valid = validateInputs(formData.email, formData.password);
    if (!valid) return;
    try {
      setIsSigningUp(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/create-user`,
        formData,
        {
          timeout: 15000,
        }
      );
      if (response.status !== 201) {
        throw new Error("Signup Failed.");
      }
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "API Error: ",
          error?.response?.data?.detail ?? error?.message
        );
        setError(error?.response?.data?.detail ?? error?.message);
      } else {
        console.error("Unknown Error: ", error);
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <>
      {!isSigningUp && !error && (
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
              type="email"
              placeholder="john_doe@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 rounded-lg px-4 py-2 text-[#1e1e1e]"
            />
            <label htmlFor="password" className="mt-4 text-lg">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="johndoe123"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 rounded-lg px-4 py-2 text-[#1e1e1e]"
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
      )}
      {isSigningUp && <Spinner />}
      {error && (
        <>
          <button className="ml-2 text-[#d2d2d2]" onClick={() => setError("")}>
            &larr; Back
          </button>
          <div className="flex flex-col items-center gap-6 text-center text-[#d2d2d2]">
            <h1 className="text-lg">An error occured</h1>
            <p>{error}</p>
          </div>
        </>
      )}
    </>
  );
}

export default Signup;
