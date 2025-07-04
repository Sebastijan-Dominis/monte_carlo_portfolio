import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";
import Spinner from "../spinner/Spinner";
import ErrorDisplay from "../components/ErrorDisplay";
import AuthForm from "./AuthForm";
import { validateCredentials } from "./validateCredentials";

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

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = validateCredentials(email, password);
    if (!valid) return;
    await login(email, password);
  };

  useEffect(() => {
    return () => {
      setError("");
    };
  }, [setError]);

  return (
    <>
      {!isLoggingIn && !error && (
        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleMain={handleLogin}
          purpose="login"
        />
      )}
      {isLoggingIn && <Spinner />}
      {error && <ErrorDisplay error={error} setError={setError} />}
    </>
  );
}

export default Login;
