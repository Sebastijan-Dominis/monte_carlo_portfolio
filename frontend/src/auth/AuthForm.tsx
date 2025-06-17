import { Link } from "react-router-dom";
import { type FormEvent } from "react";

interface AuthFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleMain: (e: FormEvent<HTMLFormElement>) => void;
  purpose: string;
}

function AuthForm({
  email,
  setEmail,
  password,
  setPassword,
  handleMain,
  purpose,
}: AuthFormProps) {
  return (
    <div className="flex h-[70dvh] flex-col justify-evenly text-[#d2d2d2] md:text-lg lg:text-xl">
      <form
        onSubmit={handleMain}
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
          {purpose === "login" && "Don't have an account yet?"}
          {purpose === "signup" && "Already have an account?"}
        </p>
        <Link
          to={purpose === "login" ? "/signup" : "/login"}
          className="mx-auto my-2 block text-center font-bold text-[#d2d2d2]"
        >
          Signup &rarr;
        </Link>
      </div>
    </div>
  );
}

export default AuthForm;
