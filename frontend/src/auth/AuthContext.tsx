import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  email: string;
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
  //   const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const login = async (email: string, password: string) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/authorize`,
        formData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      if (response.status !== 200) {
        throw new Error("Login failed");
      }
      localStorage.setItem("token", response.data.access_token);
      // navigate()
      setIsLoggedIn(true);
      setEmail(email);
    } catch (error) {
      console.error("Login failed:", error);
      // if(error.response.status === 401) {
      //     navigate("/login")
      // }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setEmail("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, email, login, logout }}>
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
