import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";
import Spinner from "../spinner/Spinner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, error, setError, isLoggingIn } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !error) {
      navigate("/");
    }
  }, [navigate, error]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(email, password);
  };

  return (
    <>
      {!isLoggingIn && !error && (
        <div className="flex h-[70dvh] flex-col justify-evenly text-[#d2d2d2] md:text-lg lg:text-xl">
          <form
            onSubmit={handleLogin}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl">Login</h1>
            <label
              htmlFor="email"
              className="mt-4 text-lg md:mt-8 md:text-xl lg:text-2xl"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john_doe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 rounded-lg px-4 py-2 text-[#1e1e1e]"
              autoComplete="email"
            />
            <label
              htmlFor="password"
              className="mt-2 text-lg md:mt-4 md:text-xl lg:text-2xl"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="johndoe123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 rounded-lg px-4 py-2 text-[#1e1e1e]"
              autoComplete="current-password"
            />
            <button className="mt-8 h-8 w-32 rounded-lg bg-[#d2d2d2]/90 text-sm text-[#1e1e1e] md:mt-10 md:h-10 md:w-40 md:text-base lg:h-12 lg:w-48 lg:text-lg">
              Login
            </button>
          </form>
          <div className="flex flex-col">
            <p className="text-center font-semibold text-[#d2d2d2]">
              Don't have an account yet?
            </p>
            <Link
              to={"/signup"}
              className="mx-auto my-2 block text-center font-bold text-[#d2d2d2]"
            >
              Signup &rarr;
            </Link>
          </div>
        </div>
      )}
      {isLoggingIn && <Spinner />}
      {error && (
        <div className="md:mt-4 md:text-lg lg:mt-8 lg:text-xl xl:text-2xl">
          <button
            className="ml-2 text-[#d2d2d2] md:ml-6 lg:ml-8 xl:ml-10"
            onClick={() => setError("")}
          >
            &larr; Back
          </button>
          <div className="flex flex-col items-center gap-6 text-center text-[#d2d2d2] md:mt-4 lg:mt-8 xl:mt-12">
            <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl">
              An error occured
            </h1>
            <p className="lg:mt-4 xl:mt-8">{error}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
