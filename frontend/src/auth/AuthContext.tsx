import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isLoggedIn: boolean;
  email: string;
  isLoggingIn: boolean;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = function ({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const currEmail = localStorage.getItem("email");
    if (currEmail) setEmail(currEmail);
  }, []);

  const validateInputs = (email: string, password: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (!password || password.length < 8 || password.length > 20) {
      alert("Please enter a valid password.");
      return false;
    }
    return true;
  };

  const login = async (email: string, password: string) => {
    const valid = validateInputs(email, password);
    if (!valid) return;
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    setIsLoggingIn(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/authorize`,
        formData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 15000,
        }
      );
      if (response.status !== 200) {
        throw new Error("Login failed");
      }
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("email", email);
      setIsLoggedIn(true);
      setEmail(email);
      navigate("/");
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
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setEmail("");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, email, isLoggingIn, error, setError, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth used outside of the AuthProvider");
  }
  return context;
}

export { useAuth };
