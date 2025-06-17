import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";
import Spinner from "../spinner/Spinner";
import ErrorDisplay from "../components/ErrorDisplay";
import AuthForm from "./AuthForm";
import { validateCredentials } from "./validateCredentials";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, isSigningUp, error, setError } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !error) {
      navigate("/");
    }
  }, [navigate, error]);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valid = validateCredentials(email, password);
    if (!valid) return;
    await signup(email, password);
  };

  useEffect(() => {
    return () => {
      setError("");
    };
  }, [setError]);

  return (
    <>
      {!isSigningUp && !error && (
        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleMain={handleSignup}
          purpose="signup"
        />
      )}
      {isSigningUp && <Spinner />}
      {error && <ErrorDisplay error={error} setError={setError} />}
    </>
  );
}

export default Signup;
