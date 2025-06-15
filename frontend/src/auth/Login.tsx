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
        <div className="flex h-[70dvh] flex-col justify-evenly text-[#d2d2d2]">
          <form
            onSubmit={handleLogin}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="text-2xl">Login</h1>
            <label htmlFor="email" className="mt-4 text-lg">
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
            <label htmlFor="password" className="mt-4 text-lg">
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
            <button className="mt-8 h-8 w-32 rounded-lg bg-[#d2d2d2]/90 text-sm text-[#1e1e1e]">
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

export default Login;
